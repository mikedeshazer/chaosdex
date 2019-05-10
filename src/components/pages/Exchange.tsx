import * as qs from "query-string";
import * as React from "react";

import { RouteComponentProps } from "react-router";

import { Loading } from "@renex/react-components";
import { NewOrder } from "../../components/NewOrder";
import { _captureInteractionException_ } from "../../lib/errors";
import { connect, ConnectedProps } from "../../state/connect";
import { OrderContainer } from "../../state/containers";
import { Token } from "../../store/types/general";
import { _catch_ } from "../views/ErrorBoundary";

/**
 * Home is a page whose principal component allows users to open orders.
 */
class ExchangeClass extends React.Component<Props, Exchange> {
    private readonly orderContainer: OrderContainer;

    constructor(props: Props) {
        super(props);
        [this.orderContainer] = this.props.containers;
    }

    public componentDidMount(): void {
        try {
            const queryParams = qs.parse(this.props.location.search);

            // Set market pair based on URL
            const sendToken = queryParams.send;
            const receiveToken = queryParams.receive;

            if (sendToken) {
                this.orderContainer.updateSendToken(sendToken as Token);
            }

            if (receiveToken) {
                this.orderContainer.updateReceiveToken(receiveToken as Token);
            }
        } catch (error) {
            _captureInteractionException_(error, {
                description: "Error in Exchange.componentDidMount",
                shownToUser: "No",
            });
        }
    }

    /**
     * The main render function.
     * @dev Should have minimal computation, loops and anonymous functions.
     */
    public render = (): React.ReactNode => {
        return <div className="exchange">
            <div className="content container exchange-inner">
                <div className="exchange--center">
                    {_catch_(
                        <React.Suspense fallback={<Loading />}>
                            <NewOrder disabled={false} />
                        </React.Suspense>
                    )}
                </div>
            </div>
        </div>;
    }
}

interface Props extends ConnectedProps, RouteComponentProps {
}

interface Exchange {
}

export const Exchange = connect<Props>([OrderContainer])(ExchangeClass);
