export default {
    name: "order",
    type: "document",
    title: "Order",
    fields: [
      {
        name: "fullname",
        title: "Full Name",
        type: "string",
      },
      {
        name: "address",
        title: "Address",
        type: "string",
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "number",
      },
      {
        name: "region",
        title: "Region",
        type: "string",
      },
      {
        name: "streetnumber",
        title: "Street Number",
        type: "string",
      },
      {
        name: "area",
        title: "Area",
        type: "string",
      },
      {
        name: "email",
        type: "email",
        title: "Email",
      },
      {
        name: "cartItems",
        title: "Cart Items",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "foodItem",
                title: "Food Item",
                type: "reference",
                to: [{ type: "food" }],
              },
              {
                name: "quantity",
                title: "Quantity",
                type: "number",
              },
            ],
          },
        ],
      },
      {
        name: "status",
        title: "Order Status",
        type: "string",
        options: {
          list: [
            { title: "Pending", value: "pending" },
            { title: "Success", value: "success" },
            { title: "Dispatch", value: "dispatch" },
          ],
          layout: "radio",
        },
        initialValue: "pending",
      },
      {
        name: "orderDate",
        title: "Order Date",
        type: "datetime",
      },
    ],
  };
  