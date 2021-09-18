import { Connection, clusterApiUrl } from "@solana/web3.js";
import React, { useEffect, useState } from "react";

import { Typography, Card } from "antd";
const { Title } = Typography;

export type Query = { searchValue?: string; searchType?: string };

export type Confirmations = number | "max";
export type Timestamp = number | "unavailable";

export type Data = {
  signature: string;
  info: {
    slot: number;
    timestamp: Timestamp;
    confirmations: Confirmations;
    confirmationStatus: "processed" | "confirmed" | "finalized" | undefined;
    result: {
      err: string | {} | null;
    };
  } | null;
};

export default function TxDetailsCard({ query }: { query: Query }) {
  const [txData, setTxData] = useState<Data>();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url, "finalized");

    let data;
    try {
      if (query.searchValue !== undefined) {
        const { value } = await connection.getSignatureStatus(
          query.searchValue,
          {
            searchTransactionHistory: true,
          }
        );

        let info = null;
        if (value !== null) {
          let confirmations: Confirmations;
          if (typeof value.confirmations === "number") {
            confirmations = value.confirmations;
          } else {
            confirmations = "max";
          }

          let blockTime = null;
          try {
            blockTime = await connection.getBlockTime(value.slot);
          } catch (error) {
            console.log(error);
          }
          let timestamp: Timestamp =
            blockTime !== null ? blockTime : "unavailable";

          info = {
            slot: value.slot,
            timestamp,
            confirmations,
            confirmationStatus: value.confirmationStatus,
            result: { err: value.err },
          };
        }
        console.log("info", info);
        data = { signature: query.searchValue, info };
        setTxData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card
      hoverable
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title level={3}>Transaction</Title>
      <table>
        <tr>
          <td>Signature</td>
          <td>{query.searchValue?.substr(0, 20)}...</td>
        </tr>
        <tr>
          <td>Result</td>
          <td>{txData?.info?.result.err ? "Failed" : "Success"}</td>
        </tr>
        <tr>
          <td>Timestamp</td>
          <td>
            {txData?.info?.timestamp !== "unavailable" ? (
              <p>{txData?.info?.timestamp}</p>
            ) : (
              <p>Unavailable</p>
            )}
          </td>
        </tr>
        <tr>
          <td>Confirmation Status</td>
          <td>{txData?.info?.confirmationStatus || "Unknown"}</td>
        </tr>
        <tr>
          <td>Confirmations</td>
          <td>{txData?.info?.confirmations}</td>
        </tr>
        <tr>
          <td>Block</td>
          <td>{txData?.info?.slot}</td>
        </tr>
      </table>
    </Card>
  );
}
