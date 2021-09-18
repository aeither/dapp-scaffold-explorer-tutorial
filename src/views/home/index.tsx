import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { Button, Col, Row, Divider } from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { TokenIcon } from "../../components/TokenIcon";
import { useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import { useUserBalance, useUserTotalBalance } from "../../hooks";
import { WRAPPED_SOL_MINT } from "../../utils/ids";
import { formatUSD } from "../../utils/utils";

import PriceCard from "../../components/PriceCard";
import SupplyCard from "../../components/SupplyCard.tsx";
import StatsCard from "../../components/StatsCard.tsx";
import SearchCard from "../../components/SearchCard";

export const HomeView = () => {
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { tokenMap } = useConnectionConfig();
  const SRM_ADDRESS = "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt";
  const SRM = useUserBalance(SRM_ADDRESS);
  const SOL = useUserBalance(WRAPPED_SOL_MINT);
  const { balanceInUSD: totalBalanceInUSD } = useUserTotalBalance();

  useEffect(() => {
    const refreshTotal = () => {};

    const dispose = marketEmitter.onMarket(() => {
      refreshTotal();
    });

    refreshTotal();

    return () => {
      dispose();
    };
  }, [marketEmitter, midPriceInUSD, tokenMap]);

  return (
    <Row gutter={[16, 16]} align="middle" justify="center">
      
      <Col span={24}>
        <PriceCard />
      </Col>
      <Col span={24}>
        <SupplyCard />
      </Col>
      <Col span={24}>
        <StatsCard />
      </Col>
      <Col span={24}>
        <SearchCard />
      </Col>

      <Col span={12}>
        <WalletMultiButton type="ghost" />
      </Col>
      <Col span={12}>
        <Link to="/faucet">
          <Button>Faucet</Button>
        </Link>
      </Col>
      <Col span={24}>
        <div className="builton" />
      </Col>
    </Row>
  );
};
