# Component composition that worked for me

In react, the most interesting part for me while I was learning it, was the component creation since you are upscaling yourself from multi-page applications like php or vanilla javascript. Those are the basic building blocks for creating a UI in react. Why I feel it more interesting is just because of its reusability nature. We can create a component that can used in multiple places, but only struggle is to architecting the component to fit in every possible ways. That's could be hard but once you understand the basic tricks it will started falling in correct places.

In the beginning, I was building react component development in the conventional way. 

> Like building component without architecting it properly and in case of reusability it became a nightmare, for maintaining the props in the component and maintaining the entire components.

Nowadays if you are more depend on AI, and if you are not composing the AI while building the products most of the time it ended up giving the same nightmare while you are reviewing the code. Since AI is there it's not nightmare for us (May be or May be not 🤷‍♂️)


Too much of drama, let's get in to business. Let's define the problem what I am trying to tell here.


![Basic UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l25ycmjiycwrtjf0n0vb.png)


Consider checking the above image. In that image I am trying to render a list of product packages. Don't mind the level 1 notation, where it is used to identify various scenarios. 

So let's write some code for the above screenshot.

Assume this is the list which I am trying to render.
```json
const PRODUCTS: Array<Product> = [
  {
    id: 1,
    name: "Product 1",
    description: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Product 2",
    description: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    isBestSeller: true,
  },
  {
    id: 3,
    name: "Product 3",
    description: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
  {
    id: 4,
    name: "Product 4",
    description: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
  {
    id: 5,
    name: "Product 5",
    description: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
  {
    id: 6,
    name: "Product 6",
    description: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
];
```

And listing logic would be straight forward, right!

```react
export default function App() {
  return (
    <div className="App">
      <div className="list">
        <h1>Product Packages (level 1)</h1>
        <div className="products">
          {PRODUCTS.map((product) => (
            <ProductCard product={product}/>
          ))}
        </div>
      </div>
  );
}
```

And `ProductCard` would look like this

```react
export interface Product {
  id: number;
  name: string;
  description: string;
  isBestSeller?: boolean;
}

type ProductProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductProps) => {
  return (
    <div className="card">
      {product.isBestSeller ? (
        <div className="badge">{"Best Seller"}</div>
      ) : null}
      <div className="image"></div>
      <h6 className="title">{product.name}</h6>
      <p className="description">{product.description}</p>
      <div className="actions">
          <button className="action secondary">View Details</button>
          <button className="action primary">Purchase</button>
      </div>
    </div>
  );
};

export default ProductCard;
```

Right now `ProductCard` seems neat, but I will show you how we can complicate it.

Lets try adding another scenario.

So In my level 2, I wanted show only one action button lets say Purchase button only.

![Level 2 Scenario](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/naodexjhuwh8g6qlphjl.png)

So in that case, usually what I does was, adding a new prop will solves the problem right? 

```react
{PRODUCTS.map((product) => (
   <ProductCard product={product} showViewButton={false}/>
))}
```

```react
type ProductProps = {
  product: Product;
  showViewButton?: boolean;
};

const ProductCard = ({
  product,
  showViewButton = true,
}: ProductProps) => {
      ...
      <div className="actions">
        {showViewButton && (
          <button className="action secondary">View Details</button>
        )}
      </div>
      ...
  );
};
```

Done. This will now show only purchase button if you pass `showViewButton` prop as `false`.

Let's build level3 scenario. In this I don't want any action buttons.

![Level 3 Scenario](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wnmtvg0kj2bn40kco9r5.png)

Again, adding a prop will work here as well.

```react
{PRODUCTS.map((product) => (
   <ProductCard product={product} 
    showViewButton={false}
    showPurchaseButton={false}
   />
))}
```

```react
type ProductProps = {
  product: Product;
  showViewButton?: boolean;
  showPurchaseButton?: boolean;
};

const ProductCard = ({
  product,
  showViewButton = true,
  showPurchaseButton = true,
}: ProductProps) => {
      ...
      <div className="actions">
        {showViewButton && (
          <button className="action secondary">View Details</button>
        )}
        {showPurchaseButton && (
          <button className="action primary">Purchase</button>
        )}
      </div>
      ...
  );
};
```
Right now the complexity for the component have been increased in terms of maintainability. Let's make even more complex. In Level 4, I wanted to show custom text for Best Seller badge. If you remember we have been hardcoded the Best Seller text inside the product card. Again the best option is to passing it as prop right? 

![Level 4 Scenario](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p4xopj9wbfsetnv2hsip.png)

```react
{PRODUCTS.map((product) => (
   <ProductCard product={product} 
    badgeText="New Text"
    showViewButton={false}
    showPurchaseButton={false}
   />
))}
```

```react
type ProductProps = {
  product: Product;
  badgeText?: string;
  showViewButton?: boolean;
  showPurchaseButton?: boolean;
};

const ProductCard = ({
  product,
  badgeText,
  showViewButton = true,
  showPurchaseButton = true,
}: ProductProps) => {
      ...
      {product.isBestSeller ? (
        <div className="badge">{badgeText || "Best Seller"}</div>
      ) : null}
      ...
  );
};
```

Let's make it step more complex. In Level 5 I want show Wishlist button.

![Level 5 Scenario](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tb4ztwp3s3ddlwvlsx19.png)

Well again adding props will fix here as well.

```react
{PRODUCTS.map((product) => (
   <ProductCard product={product} 
    showViewButton={false}
    showPurchaseButton={false}
    showWishlistButton={true}
   />
))}
```

```react
type ProductProps = {
  product: Product;
  badgeText?: string;
  showViewButton?: boolean;
  showPurchaseButton?: boolean;
  showWishlistButton?: boolean;
};

const ProductCard = ({
  product,
  badgeText,
  showViewButton = true,
  showPurchaseButton = true,
}: ProductProps) => {
      ...
      <div className="actions">
        {showViewButton && (
          <button className="action secondary">View Details</button>
        )}
        {showPurchaseButton && (
          <button className="action primary">Purchase</button>
        )}
        {showWishlistButton && (
          <button className="action primary">Wishlist</button>
        )}
      </div>
      ...
  );
};
```

Right now, each feature adding resulted in adding new props and changes in the `ProductCard` component and made it complex. If in future if new levels with new feature were added, it again spike the complex if we keep on adding props and managing the render using props.

So what we can do here or what actually worked me here on solving this problem is by making each element a reusable one or a generic one so that. Simple as that. This is not a latest technique which I am introducing, it's a pretty old one which is still relevant.

I will show you how

```react
type CardProps = PropsWithChildren;
const Card = ({ children }: CardProps) => (
  <div className="card">{children}</div>
);


type CardTitleProps = PropsWithChildren;
const CardTitle = ({ children }: CardTitleProps) => (
  <h6 className="title">{children}</h6>
);

type CardDescriptionProps = PropsWithChildren;
const CardDescription = ({ children }: CardDescriptionProps) => (
  <p className="description">{children}</p>
);

type CardActionProps = ComponentProps<"button">;
const CardAction = ({ className, ...props }: CardActionProps) => (
  <button className={`action ${className}`} {...props} />
);

const CardImage = () => <div className="image"></div>;

type CardBadgeProps = {
  hidden?: boolean;
} & PropsWithChildren;
const CardBadge = ({ hidden = false, children }: CardBadgeProps) => {
  if (hidden) return null;
  return <div className="badge">{children}</div>;
};
```

Now every component is stripped to its molecular level. Since every components are base form you can export each element to build the UI which Like you wanted. Or you can use dot notations to add you function components to another functional component like this:

```react
export default Card;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Action = CardAction;
Card.Badge = CardBadge;
Card.Image = CardImage;
```

And you can import and use it like
```react
import Card from "./Card";
....
<Card>
    <Card.Badge hidden={!product.isBestSeller}>Best Seller</Card.Badge>
    <Card.Image />
    <Card.Title>{product.name}</Card.Title>
    <Card.Description>{product.description}</Card.Description>
    <div className="actions">
        <Card.Action className="secondary">View Details</Card.Action>
        <Card.Action className="primary">Purchase</Card.Action>
    </div>
 </Card> 
```

Now the problem is not solved here, the above code is the replica of the Level 1 product card what about others? Right now we have building blocks, what we usually does with that? build it right? The fact is that, it does not making any duplications here, but reusing the existing components. Let's make me show you the final one as well.

```react
import Card from "./Card";
import { Product } from "./Product";

type CardProps = {
  product: Product;
};

const Level1Card = ({ product }: CardProps) => (
  <Card>
    <Card.Badge hidden={!product.isBestSeller}>Best Seller</Card.Badge>
    <CardCommonThings product={product} />
    <div className="actions">
      <Card.Action className="secondary">View Details</Card.Action>
      <Card.Action className="primary">Purchase</Card.Action>
    </div>
  </Card>
);

const Level2Card = ({ product }: CardProps) => (
  <Card>
    <Card.Badge hidden={!product.isBestSeller}>Best Seller</Card.Badge>
    <CardCommonThings product={product} />
    <div className="actions">
      <Card.Action className="primary">Purchase</Card.Action>
    </div>
  </Card>
);

const Level3Card = ({ product }: CardProps) => (
  <Card>
    <Card.Badge hidden={!product.isBestSeller}>Best Seller</Card.Badge>
    <CardCommonThings product={product} />
  </Card>
);

type Level4CardProps = CardProps & {
  badgeText: string;
  hideBadge?: boolean;
};
const Level4Card = ({
  product,
  badgeText = "Best Seller",
  hideBadge,
}: Level4CardProps) => (
  <Card>
    <Card.Badge hidden={hideBadge}>{badgeText}</Card.Badge>
    <CardCommonThings product={product} />
  </Card>
);

const Level5Card = ({ product }: CardProps) => (
  <Card>
    <Card.Badge hidden={!product.isBestSeller}>Best Seller</Card.Badge>
    <CardCommonThings product={product} />
    <div className="actions">
      <Card.Action className="primary">Wishlist</Card.Action>
    </div>
  </Card>
);

const CardCommonThings = ({ product }: CardProps) => (
  <>
    <Card.Image />
    <Card.Title>{product.name}</Card.Title>
    <Card.Description>{product.description}</Card.Description>
  </>
);

export { Level1Card, Level2Card, Level3Card, Level4Card, Level5Card };

```

If you are thinking about the functionalities, like purchase / view / Wishlist actions. For that I usually go by using custom hooks or providers to defined the actions generically and reuse it everywhere it needed. That's sound straight forward right?

Code became smaller and easy to understand and readable so as the maintainability as well.

On a closing note, this technique made super easy for me to maintain the components. I found my peers also found easy while reviewing the PRs or reusing the components I written in some other scenarios. Here  I am attaching the full working code with the above examples here.

{% embed https://codesandbox.io/embed/43h8gz?view=editor&module=%2Fsrc %}
