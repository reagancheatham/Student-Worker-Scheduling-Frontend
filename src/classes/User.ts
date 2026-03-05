export class User {
  constructor(
    public id: number,
    public studentID: number,
    public permissionRoleID: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phoneNumber: string,
    public token: string,
    public profilePicture?: string,
  ) {}
}
