// export default function ProductTable({ products, onDelete }) {
//   return (
//     <table width="100%" border="1" cellPadding="10">
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Price</th>
//           <th>Stock</th>
//           <th>Category</th>
//           <th>Actions</th>
//         </tr>
//       </thead>

//       <tbody>
//         {products.map((product) => (
//           <tr key={product.id}>
//             <td>{product.name}</td>
//             <td>${product.price}</td>
//             <td>{product.stock_quantity}</td>
//             <td>{product.category_name || "N/A"}</td>
//             <td>
//               <button onClick={() => onDelete(product.id)}>
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }