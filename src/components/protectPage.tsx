import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import useRefreshOnFocus from "../hooks/useRefetchOnScreenFocus";
import { getUserSubscriptionStatus } from "../api/queries";
import SubscribeView from "./subscribeView";

export default function ProtectPage({ children }: PropsWithChildren) {
  const { data: isSubscribedUser, refetch } = useQuery({
    queryKey: ["userSubscriptionStatus"],
    queryFn: getUserSubscriptionStatus,
  });

  useRefreshOnFocus(refetch);

  if (isSubscribedUser === false) return <SubscribeView />;

  return children;
}
