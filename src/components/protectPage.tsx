import { PropsWithChildren, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

import { useUserSubscriptionStore } from "../stores/subscriptionStore";
import { useAuthStore } from "../stores/authStore";
import SubscribeView from "./subscribeView";


export default function ProtectPage({ children }: PropsWithChildren) {

    const { user } = useAuthStore();
    const [userIsSubscribed, setUserIsSubscribed] = useState<boolean>(false)

    useEffect(() => {
        const checkUserSubscription = () => {
            const { lastSubscriptionPlan, lastSubscriptionExpiresAt } = user.data;
            if (!lastSubscriptionPlan) return;

        }


        checkUserSubscription()
    }, [])

    if (!userIsSubscribed) return <SubscribeView />

    return (
        <>
            {children}
        </>
    )
}