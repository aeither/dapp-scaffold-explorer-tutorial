import { Connection, clusterApiUrl } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { displayTimestampUtc } from "../../utils/utils";

import { Typography, Card } from "antd";
const { Title } = Typography;

export const SAMPLE_HISTORY_HOURS = 6;

export type ClusterStats = {
  absoluteSlot: number;
  blockHeight: number | undefined;
  blockTime: number;
  currentEpoch: string;
  epochProgress: string;
};

export default function StatsCard() {
  const [clusterStats, setClusterStats] = useState<ClusterStats>();
  useEffect(() => {
    getClusterStats();
  }, []);
  async function getClusterStats() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url);

    const epochInfo = await connection.getEpochInfo();
    const blockTime = await connection.getBlockTime(epochInfo.absoluteSlot);
    const { blockHeight, absoluteSlot } = epochInfo;
    const currentEpoch = epochInfo.epoch.toString();
    const { slotIndex, slotsInEpoch } = epochInfo;
    const epochProgress = ((100 * slotIndex) / slotsInEpoch).toFixed(1) + "%";

    if (blockTime !== null) {
      const clusterStatsData = {
        absoluteSlot,
        blockHeight,
        blockTime: blockTime * 1000,
        currentEpoch,
        epochProgress,
      };
      setClusterStats(clusterStatsData);
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
      <Title level={3}>Cluster Stats</Title>
      {clusterStats ? (
        <table>
          <tr>
            <td>Slot</td>
            <td>{clusterStats.absoluteSlot}</td>
          </tr>
          {clusterStats.blockHeight !== undefined && (
            <tr>
              <td>Block height</td>
              <td>{clusterStats.blockHeight}</td>
            </tr>
          )}
          {clusterStats.blockTime && (
            <tr>
              <td>Cluster time</td>
              <td> {displayTimestampUtc(clusterStats.blockTime)}</td>
            </tr>
          )}
          <tr>
            <th>Epoch</th>
            <th>{clusterStats.currentEpoch}</th>
          </tr>
          <tr>
            <th>Epoch progress</th>
            <th>{clusterStats.epochProgress}</th>
          </tr>
        </table>
      ) : (
        <p>No Data</p>
      )}
    </Card>
  );
}
