import React from 'react';
import Navbar from './Navbar';
import Wrapper from './Wrapper';
export type WrapperVariant = 'small' | 'regular';
interface Props {
  variant?: WrapperVariant;
  horizontalCenter?: boolean;
}

const Layout: React.FC<Props> = ({
  children,
  variant = 'regular',
  horizontalCenter = false,
}) => {
  return (
    <>
      <Navbar />
      <Wrapper horizontalCenter={horizontalCenter} variant={variant}>
        {children}
      </Wrapper>
    </>
  );
};

export default Layout;
