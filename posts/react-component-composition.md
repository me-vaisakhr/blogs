---
title: "Component Composition That Worked for Me"
date: "2024-10-24"
category: "React"
description: "How I solved component complexity using composition patterns in React - breaking down components to their molecular level for better reusability and maintainability"
tags: ["react", "components", "architecture", "typescript", "frontend"]
crossPosts:
  - platform: "dev.to"
    url: "https://dev.to/example"
  - platform: "LinkedIn"
    url: "https://linkedin.com/example"
---

# Component Composition That Worked for Me

When I was learning React, the most interesting part for me was component creation - especially coming from a background of multi-page applications like PHP or vanilla JavaScript. Components are the basic building blocks for creating UIs in React, and what makes them so fascinating is their reusability. You can create a component and use it in multiple places, but the real struggle is architecting it to fit every possible scenarios. That can be tough, but once you understand the basic tricks, everything starts falling into place 🎯

In the beginning, I was building React components the conventional way.

> Building components without properly architecting them. When it came to reusability, it became a nightmare - maintaining all the props and managing the entire component structure was painful.

Nowadays, if you're heavily relying on AI and not carefully crafting your prompts while building products, you'll often end up with the same nightmare when reviewing the code. Since AI is here to help though, maybe it's not a nightmare anymore... or maybe it still is 🤷‍♂️


Alright, enough drama - let's get down to business. Let me show you the problem I'm talking about.


![Basic UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l25ycmjiycwrtjf0n0vb.png)


Check out the image above. I'm rendering a list of product packages. Don't mind the "Level 1" notation - I'm using it to identify different scenarios.

Let's write some code for this.

Here's the list I'm trying to render:
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

The listing logic is straightforward, right?

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

And the `ProductCard` would look like this:

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

Right now, `ProductCard` looks pretty neat. But let me show you how things can get complicated.

Let's add another scenario.

In Level 2, I want to show only one action button - let's say just the Purchase button.

![Level 2 Scenario](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/naodexjhuwh8g6qlphjl.png)

In this case, what I usually did was add a new prop. That solves the problem, right? 

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

Done! This will now show only the Purchase button if you pass the `showViewButton` prop as `false`.

Let's move to Level 3. In this scenario, I don't want any action buttons at all.

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
Now the component's complexity has increased in terms of maintainability. Let's make it even more complex. In Level 4, I want to show custom text for the Best Seller badge. Remember how we hardcoded "Best Seller" inside the product card? Again, the best option is passing it as a prop, right? 

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

Let's make it one step more complex. In Level 5, I want to show a Wishlist button.

![Level 5 Scenario](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tb4ztwp3s3ddlwvlsx19.png)

Well, again, adding props will fix this too.

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

Right now, each new feature means adding new props and changes to the `ProductCard` component, making it more complex. If we add more levels with new features in the future, the complexity will keep spiking if we continue adding props and managing renders this way. This is the nightmare I'm talking about.

So what can we do? What actually worked for me to solve this problem is making each element reusable and generic. Simple as that. This isn't some new technique I'm introducing - it's a pretty old one, but it's still super relevant.

Let me show you how:

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

Now every component is stripped down to its molecular level. Since all components are in their base form, you can export each element to build the UI however you want. Or you can use dot notation to attach your function components to another functional component like this:

```react
export default Card;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Action = CardAction;
Card.Badge = CardBadge;
Card.Image = CardImage;
```

And you can import and use it like this:
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

Now hold on - the problem isn't fully solved yet. The code above is just a replica of the Level 1 product card. What about the others? Right now we have building blocks. What do we usually do with building blocks? We build things, right? The key here is that we're not creating duplications - we're reusing the existing components. Let me show you the final solution:

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

If you're wondering about the functionalities - like purchase, view, or wishlist actions - I usually handle those using custom hooks or providers. This way I can define the actions generically and reuse them wherever needed. Sounds straightforward, right?

The code became smaller, easier to understand, more readable, and way more maintainable.

On a closing note, this technique made it super easy for me to maintain components. My peers also found it easier when reviewing PRs or reusing components I'd written in other scenarios. I'm attaching the full working code with all the examples below.

{% embed https://codesandbox.io/embed/43h8gz?view=editor&module=%2Fsrc %}

---

Hope this helps you tackle your component composition challenges! Remember, sometimes the best solution isn't adding more - it's breaking things down to their simplest form.

Until next time, happy coding! ✌️

> "Simplicity is the ultimate sophistication." – Leonardo da Vinci
