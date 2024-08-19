export interface GetData {
    page:Page,
    users:Users[],
    data:Data[] 
}

export interface Users {
    id:number,
    name:string,
    email:string,
    phone:number,
    create_at:number,
    update_at:number,
}

export interface Data {
    user_id:number,
    is_admin:boolean,
    is_ecp:boolean,
    status:string,
}

export interface Page {
    total:number,
    current:number,
    size:number
}

export interface UsersVm  {
    id?:number,
    name:string | null,
    email:string | null,
    phone:number | null,
    create_at:number | null,
    update_at:number | null,
    is_admin:boolean | null,
    status?:string | null,
    user_id?:number,
    is_ecp?:boolean,
}