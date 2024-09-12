import Link from "next/link";
import styled from "styled-components";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

const Container = styled.div`
  display: block;
  width: 100%;
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;
`;

const Section = styled.div`
  * {
    display: flex;
    align-items: center;
  }
`;

const LogoContainer = styled.a`
  padding: 10px;
  font-weight: 700;
  font-size: 20px;
  font-family: var(--serif);
`;

const Links = styled.div`
  justify-content: flex-end;

  a {
    padding: 10px;
    font-weight: 500;
    font-size: 15px;
  }
`;

const MobileMenuButton = styled.button`
  display: block;
  appearance: none;
  border: none;
  background: none;
  margin: 0;
  padding: 10px;
  pointer-events: all;

  &:focus,
  &:focus-within,
  &:active {
    outline: none;
  }

  svg {
    display: block;
    pointer-events: none;
    width: 20px;
    height: auto;
  }
`;

const LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Chrome extension", href: "/chrome-extension" },
  { label: "Use cases", href: "/use-cases" },
  { label: "Get started →", href: "/auth/sign-in" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick({ ref: menuRef, open, setOpen });

  return (
    <Container ref={menuRef}>
      <Wrapper>
        <Section>
          <LogoContainer href="/">
            <Logo fill="black" />
            PDF.ai
          </LogoContainer>
        </Section>
        <Section className="hide-mobile">
          <Links>
            {LINKS.map((link, i) => {
              return (
                <Link href={link.href} key={i} className="hover:underline">
                  {link.label}
                </Link>
              );
            })}
          </Links>
        </Section>
        <MobileMenuButton
          className="hide-desktop"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "cross" : "menu"} />
        </MobileMenuButton>
      </Wrapper>
      <MobileMenu open={open} />
    </Container>
  );
}

const MobileLinks = styled.div`
  display: block;
  padding: 10px;

  a {
    display: block;
    padding: 10px;
    font-weight: 500;
    font-size: 15px;
  }
`;

const MobileMenuContainer = styled.div<MobileMenuProps>`
  position: absolute;
  top: 59px;
  width: 100%;
  height: auto;
  background: #fff;
  border-top: 1px solid #e5e3da;
  border-bottom: 1px solid #e5e3da
  z-index: 5;
  transition: 0.1s;
  opacity: ${({ open }) => (open ? "1" : "0")};
  pointer-events: ${({ open }) => (open ? "all" : "none")};
`;

interface MobileMenuProps {
  open: boolean;
}

function MobileMenu({ open }: MobileMenuProps) {
  return (
    <MobileMenuContainer className="hide-desktop" open={open}>
      <MobileLinks>
        {LINKS.map((link, i) => {
          return (
            <Link href={link.href} key={i}>
              {link.label}
            </Link>
          );
        })}
      </MobileLinks>
    </MobileMenuContainer>
  );
}

interface UseOutsideClickProps {
  ref: MutableRefObject<HTMLDivElement | null>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function useOutsideClick({ ref, open, setOpen }: UseOutsideClickProps) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node | null)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClick);
    }

    return () => document.removeEventListener("click", handleClick);
  }, [ref, open, setOpen]);
}
