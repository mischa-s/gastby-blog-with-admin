import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import styled from "@emotion/styled";
import { Heading } from "@chakra-ui/core";
import { Text } from "@chakra-ui/core";
import ReactMarkdown from "react-markdown";
import { SimpleGrid } from "@chakra-ui/core";
import useGoogleSpreadsheet from "../lib/use-google-spreadsheet";

const Table = styled.table`
  width: 50em;
  max-width: 100%;
  overflow-x: scroll;

  th {
    background: black;
    border: 1px solid #ddd;
    color: #ddd;
    text-align: center;
    text-transform: uppercase;
  }

  th, td {
    border: 1px solid #ddd;
    font-size: 12px;
  }
`;

const Stats = ({}) => {
  const { valueRanges, isFetching } = useGoogleSpreadsheet();
  return isFetching ? (
    <div>Loading...</div>
  ) : valueRanges ? (
    <>
      {valueRanges.map((range, rangeIndex) => {
        const { values } = range;
        const rows =
          rangeIndex > 0
            ? values.map(value => [
                value[0],
                value[2],
                value[4],
                value[5],
                value[6]
              ])
            : values;
        return (
          <>
            <Heading as="h1" my="5" w="100%" size="lg" p={2}>
              {rangeIndex > 0 ?  "Player Stats" : "Standings"}
            </Heading>
            <Table>
              <thead>
                <tr>
                  {rows[0].map((header, i) => {
                    return (
                      <th key={`${i}-${header}`}>
                        <Heading
                          as="h2"
                          mb="2"
                          size="md"
                          p={2}
                        >
                          {header}
                        </Heading>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  return (
                    i > 0 && (
                      <tr>
                        {row.map((column, key) => {
                          return (
                            <td key={`${key}-${column}`}>
                              <Heading
                                textAlign={"center"}
                                p={2}
                                as="h3"
                                mb="2"
                                fontSize="md"
                              >
                                {column}
                              </Heading>
                            </td>
                          );
                        })}
                      </tr>
                    )
                  );
                })}
              </tbody>
            </Table>
          </>
        );
      })}
    </>
  ) : (
    <span>No Data</span>
  );
};

const ContentWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 50em;
  align-items: left;
  max-width: 100%;
  margin: 2em auto;

  p {
    padding: 0.75em 0;
    ul {
      list-style-position: inside;
    }
  }
`;

export const PlayPageTemplate = ({ title, details }) => {
  const { heading, description } = details;

  return (
    <ContentWrapper>
      <Heading
        as="h1"
        mb="5"
        size="xl"
        bg="blackAlpha.800"
        color="brightYellow"
        p={2}
      >
        {title}
      </Heading>
      <Stats />

      {/* <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
        {heading}
      </h2>
      <Text mb="5" fontSize="lg">
        <ReactMarkdown source={description} />
      </Text> */}
    </ContentWrapper>
  );
};

PlayPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.object
};

const PlayPage = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout>
      <PlayPageTemplate
        title={post.frontmatter.title}
        details={post.frontmatter.details}
      />
    </Layout>
  );
};

PlayPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default PlayPage;

export const PlayPageQuery = graphql`
  query PlayPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        details {
          heading
          description
        }
      }
    }
  }
`;
