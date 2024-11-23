import { IsIPAD } from "@/themes/app.constant";
import { Dimensions, Image } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
//@ts-ignore
import One from "@/assets/images/onboarding/1.png";
//@ts-ignore
import Two from "@/assets/images/onboarding/2.png";
// "Designed by slidesgo / freepik"

export const onBoardingSlides: onBoardingSlidesTypes[] = [
  {
    color: "#040424",
    title: "EFISTRAC",
    image: (
      <Image
        source={One}
        style={{
          width: IsIPAD ? verticalScale(285) : verticalScale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    subTitle: "Monitoring Cuaca. Pantau Cuaca Sekitar Sebelum Berangkat",
  },
  {
    color: "#FA8C2B",
    title: "LOGIN",
    image: (
      <Image
        source={Two}
        style={{
          width: IsIPAD ? scale(285) : scale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    subTitle: "Masuk terlebih dahulu",
  },
];

// onboarding variables
export enum Side {
  LEFT,
  RIGHT,
  NONE,
}
export const MIN_LEDGE = 25;
export const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
export const MARGIN_WIDTH = MIN_LEDGE + 50;
export const PREV = WIDTH;
export const NEXT = 0;
export const LEFT_SNAP_POINTS = [MARGIN_WIDTH, PREV];
export const RIGHT_SNAP_POINTS = [NEXT, WIDTH - MARGIN_WIDTH];

export const NotificationsData = [
  {
    id: "1",
    title: "New Answer Received",
    message: "You have a new answer in your question",
    status: "Unread",
  },
  {
    id: "2",
    title: "New Reply Received",
    message: "You have a new reply in your support question",
    status: "Unread",
  },
];