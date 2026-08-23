import {
  Hammer,
  LineChart,
  RefreshCw,
  Rocket,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { IntentpoweredLoopStageId } from "@/lib/intentpowered-loop";

export const intentpoweredLoopIcons: Record<
  IntentpoweredLoopStageId,
  LucideIcon
> = {
  intent: Target,
  build: Hammer,
  ship: Rocket,
  learn: LineChart,
  refine: RefreshCw,
};
