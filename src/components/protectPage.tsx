import { PropsWithChildren } from "react";

import { useUserSubscriptionStore } from "../stores/subscriptionStore";
import SubscribeView from "./subscribeView";


export default function ProtectPage({ children }: PropsWithChildren) {
    const userIsSubscribed = useUserSubscriptionStore(state => state.isSubscribed)

    if (!userIsSubscribed) return <SubscribeView />

    return (
        <>
            {children}
        </>
    )
}