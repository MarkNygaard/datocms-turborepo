import { isEmptyDocument } from "datocms-structured-text-utils";
import { getLocale } from "next-intl/server";
import { LayoutModelNotificationField, LayoutQuery } from "types/datocms";

import Navigation from "./Navigation";
import NotificationStrip from "./NotificationStrip";
import TopBar from "./TopBar";

type Props = {
  data: LayoutQuery;
};

const Header = ({ data }: Props) => {
  const locale = getLocale();

  return (
    <>
      {!isEmptyDocument(data.layout?.notification) && (
        <NotificationStrip
          notification={
            data.layout?.notification as LayoutModelNotificationField
          }
          locale={locale}
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
