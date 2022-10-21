import React from "react";
import { IndividualEdit } from "./IndividualEdit";

export const EditProduct = ({products}) => {

    return products.map((individualEdit) => (
        <IndividualEdit key={individualEdit.ID} individualEdit ={individualEdit}
        />
    ))
}