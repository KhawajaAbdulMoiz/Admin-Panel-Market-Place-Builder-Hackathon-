export interface Chef{
    name :string;
    position: string;
    experience: string;
    _id :string,
    specialty:string;
    available:string;
    description:string;
    tags :string
    image : {
        asset:{
            _ref:string;
            _type:"image";
        }
    }
}