import * as React from "react";

import { Loading, TokenIcon } from "@renex/react-components";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import { naturalTime } from "../../lib/conversion";
import { ETHERSCAN } from "../../lib/environmentVariables";
import { Chain } from "../../lib/shiftSDK/shiftSDK";
import { HistoryEvent, Tx } from "../../state/containers/appContainer";
import { ReactComponent as Arrow } from "../../styles/images/arrow-right.svg";
import { ReactComponent as Next } from "../../styles/images/next.svg";
import { ReactComponent as Previous } from "../../styles/images/previous.svg";
import { TokenBalance } from "../views/TokenBalance";

const txUrl = (tx: Tx | null): string => {
    if (!tx) { return ""; }
    switch (tx.chain) {
        case Chain.Ethereum:
            return `${ETHERSCAN}/tx/${tx.hash}`;
        case Chain.Bitcoin:
            return `https://live.blockcypher.com/btc-testnet/tx/${tx.hash}`;
        case Chain.ZCash:
            return `https://chain.so/tx/ZEC/${tx.hash}`;
    }
}

const OrderHistoryEntry = ({ order, t }: { order: HistoryEvent, t: i18next.TFunction }) => {
    if ((order as any).transactionHash) {
        order.outTx = (order as any).transactionHash;
    }
    return <div className="swap--history--entry">
        <div className="token--info">
            <TokenIcon className="token-icon" token={order.orderInputs.dstToken} />
            <span className="received--text">{t("history.received")}</span>
            <span className="token--amount">
                <TokenBalance
                    token={order.orderInputs.dstToken}
                    amount={order.orderInputs.dstAmount}
                />{" "}
                {order.orderInputs.dstToken}
            </span>
        </div>
        <div className="history--txs">
            <span className="swap--time">{naturalTime(order.time, { message: "Just now", suffix: "ago", countDown: false, abbreviate: true })}</span>
            <a target={order.inTx ? "_blank" : ""} className="tx-in" rel="noopener noreferrer" href={txUrl(order.inTx)}>
                {order.inTx ? <Arrow /> : <Loading />}
            </a>
            <a target={order.outTx ? "_blank" : ""} className="tx-out" rel="noopener noreferrer" href={txUrl(order.outTx)}>
                {order.outTx ? <Arrow /> : <Loading />}
            </a>
        </div>
    </div>;
};

/**
 * OrderHistory is a visual component for allowing users to open new orders
 */
export const OrderHistory = (props: Props) => {
    const { t } = useTranslation();
    const [start, setStart] = React.useState(0);

    const nextPage = () => { setStart(start + 5); };
    const previousPage = () => { setStart(Math.max(start - 5, 0)); };

    const { orders } = props;
    if (orders.length === 0) {
        return <></>;
    }
    return <>
        <div className="section history">
            <div className="history--banner">
                <span>{t("history.history")}</span>
            </div>
            <div className="history--list">
                {orders.slice(start, start + 5).map(historyEvent => {
                    return <OrderHistoryEntry
                        t={t}
                        key={historyEvent.inTx ? historyEvent.inTx.hash : historyEvent.outTx ? historyEvent.outTx.hash : historyEvent.time}
                        order={historyEvent}
                    />;
                })}
            </div>
            {orders.length > 5 ? <div className="history--pages">
                <button disabled={start === 0} onClick={previousPage}><Previous /></button>
                <div className="history--page-count">Page {start / 5 + 1} of {Math.ceil(orders.length / 5)}</div>
                <button disabled={start + 5 > orders.length} onClick={nextPage}><Next /></button>
            </div> : null}
        </div>
    </>;
};

interface Props {
    orders: HistoryEvent[];
}