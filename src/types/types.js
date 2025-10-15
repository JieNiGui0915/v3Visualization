// Path: src\types\types.js

/** @typedef {{Id:number,UserName:string,PhoneNum:string,Gender:number,GenderString:string,State:number,RoleId:number,RoleName:string}} AccountDto */

/** @typedef {{Id:number,UserName:string,PhoneNum:string,RoleId:number}} AccountSimpleDto */

/** @typedef {{UserName:string,PhoneNum:string,Gender:0|1|2,RoleName:string}} AccountAddInput */

/** @typedef {{id:number,roleName:string,roleId:number,roleCode:string}} Role */

/**
 * @typedef Ref<T> ref
 * @property {T} value
 */

/**
 @typedef {{addressId:string,areaNum:number,buildingNum:number,floor:string,roomName:string,buildingArea:number,usableArea:number,isDel:boolean}} AddressEntity */

/** @typedef {{id:number,roleName:string,roleId:number,roleCode:string}} CompanyInfo */
/** @typedef {{comId:number,comName:string,comShortName:string,roomNum:string}} SimpleCustomerDto */
