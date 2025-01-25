export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    discord: string;
    github: string;
  };
};

export interface ViewDashboardType {
  title: string;
  Icon: FC<{ className: string }>;
  href: string;
  isActive: boolean;
  items: DashboradActionsType[];
}

export interface DashboradActionsType {
  href: string;
  Icon: FC<{ className: string }>;
  title: string;
  description: string;
  disabled?: boolean;
}
