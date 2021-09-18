import {
  Connection,
  clusterApiUrl,
  PublicKey,
  ConfirmedSignatureInfo,
} from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";

import { Typography, Card } from "antd";
const { Title } = Typography;

export type History = {
  fetched: ConfirmedSignatureInfo[];
};

export default function HistoryCard({ pubkey }: { pubkey: PublicKey }) {
  const [history, setHistory] = useState<History>();
  useEffect(() => {
    getHistory();
  }, [pubkey]);

  async function getHistory() {
    console.log("Hello");
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url);
    const options = {
      limit: 25,
    };
    const fetched = await connection.getConfirmedSignaturesForAddress2(
      pubkey,
      options
    );

    setHistory({ fetched });
    console.log(fetched);
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
      <Title level={3}>History</Title>
      {history?.fetched ? (
        <>
          <table>
            {history.fetched.map((item, i) => (
              <tr key={i}>
                <td>{item.signature.substr(0, 20)}...</td>
                <td>{item.slot}</td>

                <td>
                  {item?.blockTime ? (
                    <Moment date={item.blockTime * 1000} fromNow />
                  ) : (
                    ""
                  )}
                </td>
                <td>{item?.err ? "Failed" : "Success"}</td>
                <td>{item?.memo ? item.memo : ""}</td>
              </tr>
            ))}
          </table>
        </>
      ) : (
        <p> No History </p>
      )}
    </Card>
  );
}
