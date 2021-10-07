import { server } from "lib/config/server";
import { useState } from "react";
import { getSession } from "next-auth/client";
import Cart from "lib/models/cart";
import jwt from "next-auth/jwt";

// check user authentication before accessing this page
export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req });

  // if role is not student redirect to organization dashboard
  if (!session) {
    return {
      redirect: {
        destination: `${server}`,
        permanent: false,
      },
    };
  }
  
  // get request token
  let payLoad = await jwt.getToken({ req: context.req, secret: process.env.JWT_SECRET });

  // encode token
  let apiToken = await jwt.encode({ token: payLoad, secret: process.env.JWT_SECRET });

  return {
    // set session and token
    props: { session, apiToken, payLoad },
  };
}

const CartProcess = (props) => {
  const [product, setProduct] = useState('307026543906914885');
  let cart = new Cart();

  const addToCart = async () => {
    await cart.addToCart(product, props.payLoad.userRefID).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <button onClick={() => addToCart(product)}>Add To Cart</button>
  );

}

export default CartProcess;