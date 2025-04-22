import { isEmptyDocument } from "datocms-structured-text-utils";
import {
  LayoutModelNotificationField,
  LayoutQuery,
  SiteLocale,
} from "types/datocms";

import Navigation from "./Navigation";
import NotificationStrip from "./NotificationStrip";
import TopBar from "./TopBar";

type Props = {
  data: LayoutQuery;
};

const Header = ({ data }: Props) => {
  return (
    <>
      {!isEmptyDocument(data.layout?.notification) && (
        <NotificationStrip
          notification={
            data.layout?.notification as LayoutModelNotificationField
          }
        />
      )}
      {(data.layout?.topBarText || data.layout?.topBarLinks) && (
        <TopBar data={data} />
      )}
      <Navigation data={data} />
    </>
  );
};

export default Header;
