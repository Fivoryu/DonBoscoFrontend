import { ComponentType, SVGProps } from "react";

export interface SidebarItem {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  roles: string[]; // Roles permitidos para ver este ítem
}

export interface SidebarSection {
  title: string;
  titleIcon: ComponentType<SVGProps<SVGSVGElement>>;
  roles: string[];    // Roles permitidos para ver la sección
  items: SidebarItem[];
}