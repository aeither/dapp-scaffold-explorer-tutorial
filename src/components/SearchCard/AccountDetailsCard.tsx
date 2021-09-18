import { PublicKey } from "@solana/web3.js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import React, { useEffect, useState } from "react";

import HistoryCard from "./HistoryCard";

import { Typography, Card } from "antd";
const { Title } = Typography;

export type Query = { searchValue?: string; searchType?: string };

export type DataDetails = {
  program: string;
  parsed: {
    info: {
      decimals?: number;
      freezeAuthority?: string;
      isInitialized?: boolean;
      mintAuthority?: string;
      supply?: string;
      isNative?: false;
      mint?: string;
      owner?: string;
      state?: string;
      tokenAmount?: {
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
      };
    };
    type: string;
  };
};

export type Data = {
  pubkey: PublicKey;
  lamports: number;
  details?: {
    space: number;
    executable: boolean;
    owner: PublicKey;
    data?: DataDetails;
  };
};

export function AccountHeader({ data }: { data?: Data }) {
  const [detailsData, setDetailsData] = useState<DataDetails>();

  useEffect(() => {
    setDetailsData(data?.details?.data);
    console.log("detatailsData", detailsData);
  }, [data]);
  const isToken =
    detailsData?.program === "spl-token" && detailsData?.parsed.type === "mint";

  if (isToken) {
    return (
      <Card
        hoverable
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title level={3}>Token Account</Title>
        <table>
          <tr>
            <td>Address</td>
            <td>{data?.pubkey.toBase58()}</td>
          </tr>
          <tr>
            <th>Current Supply</th>
            <th>{detailsData?.parsed.info.supply}</th>
          </tr>
          <tr>
            <th>Mint Authority</th>
            <th>{detailsData?.parsed.info.mintAuthority}</th>
          </tr>
          <tr>
            <th>Decimals</th>
            <th>{detailsData?.parsed.info.decimals}</th>
          </tr>
        </table>
      </Card>
    );
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
      <Title level={3}>Account</Title>
      <table>
        <tr>
          <td>Address</td>
          <td>{data?.pubkey.toBase58()}</td>
        </tr>
        <tr>
          <th>Mint</th>
          <th>{detailsData?.parsed.info.mint}</th>
        </tr>
        <tr>
          <th>Owner</th>
          <th>{detailsData?.parsed.info.owner}</th>
        </tr>
        <tr>
          <th>State</th>
          <th>{detailsData?.parsed.info.state}</th>
        </tr>
      </table>
    </Card>
  );
}

export default function AccountDetailsCard({ query }: { query: Query }) {
  const [data, setData] = useState<Data>();
  let pubkey: PublicKey | undefined;

  useEffect(() => {
    getData();
  }, [query.searchValue]);

  async function getData() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url, "finalized");

    try {
      if (query.searchValue !== undefined) {
        pubkey = new PublicKey(query.searchValue);
        const result = (await connection.getParsedAccountInfo(pubkey)).value;

        let lamports, details;
        if (result === null) {
          lamports = 0;
        } else {
          lamports = result.lamports;

          let space: number;
          if (!("parsed" in result.data)) {
            space = result.data.length;
          } else {
            space = result.data.space;
          }

          let data: DataDetails | undefined;
          if ("parsed" in result.data) {
            data = {
              program: result.data.program,
              parsed: result.data.parsed,
            };
            details = {
              space,
              executable: result.executable,
              owner: result.owner,
              data,
            };
          } else {
            details = {
              space,
              executable: result.executable,
              owner: result.owner,
            };
          }
        }
        setData({ pubkey, lamports, details });
        console.log("address", query.searchValue);
      }
    } catch (err) {}
  }

  return (
    <>
      {!data?.pubkey ? (
        <p>Not valid pubkey</p>
      ) : (
        <>
          <AccountHeader data={data} />
          <HistoryCard pubkey={data.pubkey} />
        </>
      )}
    </>
  );
}
