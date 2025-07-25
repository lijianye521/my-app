import { getDb } from "@/lib/db";
import EnterpriseStockToolboxClient from "@/components/EnterpriseStockToolboxClient";
import { iconOptions } from "./pages/data";

const getIconByName = (iconName: string) => {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption ? iconOption.icon : iconOptions[0].icon;
};

export default async function Page() {
  const db = await getDb();
  const [platformRows] = await db.query(
    "SELECT * FROM platform_services WHERE service_type = 'platform' ORDER BY sort_order"
  );
  const [serviceRows] = await db.query(
    "SELECT * FROM platform_services WHERE service_type = 'service' ORDER BY sort_order"
  );

  const managementPlatforms = (platformRows as any[]).map((item) => ({
    id: item.service_code,
    name: item.service_name,
    description: item.service_description,
    icon: getIconByName(item.icon_name),
    iconName: item.icon_name,
    status: item.is_visible ? "运行中" : "停用",
    url: item.service_url,
    color: item.color_class,
  }));

  const techServices = (serviceRows as any[]).map((item) => ({
    id: item.service_code,
    name: item.service_name,
    description: item.service_description,
    icon: getIconByName(item.icon_name),
    iconName: item.icon_name,
    url: item.service_url,
    color: item.color_class,
  }));

  return (
    <EnterpriseStockToolboxClient
      initialPlatforms={managementPlatforms}
      initialServices={techServices}
    />
  );
}

