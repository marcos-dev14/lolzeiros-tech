import { ComponentType } from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
  RouteComponentProps
} from 'react-router-dom';

import { useAuth } from '~context/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  // component: ComponentType;
  component: ComponentType<RouteComponentProps>;
}

export function Route({
  isPrivate = true,
  component: Component,
  ...rest
}: RouteProps) {
  const { signed } = useAuth();

  if (isPrivate && !signed) {
    return <Redirect to="/" />
  }

  if (!isPrivate && signed) {
    return <Redirect to="/store/products" />
  }

  return (
    <ReactDOMRoute
      {...rest}
      render={(props) =>
        <Component {...props} />
      }
    />
  );
};
