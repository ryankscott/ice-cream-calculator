import type { ID } from "./common";

export type Supplier = {
  id: ID;
  name: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  website: string;
};
