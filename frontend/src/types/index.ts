export interface User {
  name: string;
  phone: string;
  email: string;
  address: string;
  position_name: string;
  department: string;
  hire_date: string;
}


export type UserWithId =  User & {id: string}