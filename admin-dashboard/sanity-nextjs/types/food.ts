export interface Food{
    description: any;
    available: any;
    _id :string,
    name:string,
    category:string;
    price:number;
    originalPrice:number;
    tags :string
    image : {
        asset:{
            _ref:string;
            _type:"image";
        }
    }
}
