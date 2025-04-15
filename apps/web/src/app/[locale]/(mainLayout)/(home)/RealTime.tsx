"use client";

import { generateRealtimeComponent } from "utils/WithRealTimeUpdates/generateRealtime";

import type { PageProps, Query, Variables } from "./meta";
import Content from "./Content";

const RealTime = generateRealtimeComponent<PageProps, Query, Variables>({
  contentComponent: Content,
});

export default RealTime;
