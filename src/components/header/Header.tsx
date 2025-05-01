import { Box, Flex, Overlay, rem, Stack, Transition } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FC } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Burger } from '@mantine/core'

import Logo from '@/assets/icons/logo'
import styles from './Header.module.css'
import BrandButton from '../brandButton/BrandButton'

interface MainLayoutHeaderType {
    hideBGColor?: boolean
}
const MainLayoutHeader = ({ hideBGColor }: MainLayoutHeaderType) => {
    const [opened, { toggle }] = useDisclosure(false)

    const links = [
        {
            label: 'Social',
            link: '/social',
        },
        {
            label: 'Games',
            link: '/games',
        },
        {
            label: 'Poem',
            link: '/poem',
        },
        {
            label: 'Activity',
            link: '/activity',
        },
    ]

    return (
        <>
            {opened && (
                <Overlay
                    onClick={toggle}
                    backgroundOpacity={0.35}
                    className={styles.mainOverlay}
                    fixed
                />
            )}

            <Flex
                component="header"
                className={styles.mainHeader}
                style={{ backgroundColor: hideBGColor ? 'white' : 'inherit' }}
            >
                <Transition
                    mounted={opened}
                    transition="pop"
                    duration={200}
                    timingFunction="ease"
                    keepMounted
                >
                    {(transitionStyle) => (
                        <Box
                            className={styles.mainMobileNav}
                            style={{ ...transitionStyle }}
                        >
                            <Box component="nav">
                                <Stack component="ul" gap={rem(12)} m={0}>
                                    {links.map((link) => (
                                        <li key={link.label}>
                                            <NavLink
                                                to={link.link}
                                                onClick={toggle}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    fontFamily: 'Catamaran',
                                                    fontWeight: 'bold',
                                                    borderRadius: '20px',
                                                    padding: '1px 15px',
                                                    borderWidth: '2px',
                                                }}
                                                className={({ isActive }) => {
                                                    return isActive
                                                        ? styles.active
                                                        : styles.inactive
                                                }}
                                            >
                                                {link.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </Stack>
                            </Box>
                            <BrandButton
                                component={Link}
                                to="/login"
                                radius="xl"
                                color="#8D2EFF"
                                mt={rem(24)}
                                fullWidth
                                onClick={toggle}
                            >
                                Login / Register
                            </BrandButton>
                        </Box>
                    )}
                </Transition>

                <Flex
                    align="center"
                    gap={rem(48)}
                    className={styles.mainLeftSection}
                >
                    <Link to="/" className={styles.logo}>
                        <Logo width={200} />
                    </Link>
                </Flex>

                <Flex
                    align="center"
                    gap={rem(24)}
                    className={styles.mainRightSection}
                >
                    <Flex
                        align="center"
                        direction={'row'}
                        className={styles.mainLinks}
                        gap={rem(18)}
                    >
                        {links.map((link) => (
                            <NavLink
                                to={link.link}
                                className={({ isActive }) => {
                                    return isActive
                                        ? styles.active
                                        : styles.inactive
                                }}
                                key={link.label}
                                style={{
                                    fontSize: rem(18),
                                    fontFamily: 'Catamaran',
                                    fontWeight: 'bold',
                                    borderRadius: '20px',
                                    padding: '1px 15px',
                                    borderWidth: '2px',
                                }}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </Flex>

                    <BrandButton
                        component={Link}
                        className={styles.accountButton}
                        to="/login"
                        radius="xl"
                        size="lg"
                        variant="primary"
                    >
                        Login / Register
                    </BrandButton>

                    <Burger
                        className={styles.burger}
                        opened={opened}
                        onClick={toggle}
                        size="sm"
                    />
                </Flex>
            </Flex>
        </>
    )
}

const SectionLayoutHeader = () => {
    return (
        <Flex
            component="header"
            className={styles.mainHeader}
            align="center"
            justify="space-between"
            gap={20}
        >
            <Link
                to={'#'}
                onClick={() => {
                    history.back()
                }}
            >
                <BrandButton
                    size="lg"
                    isGradient={true}
                    style={{
                        fontFamily: 'Coiny',
                        fontSize: '2.5em',
                        borderRadius: '20px',
                        color: 'white',
                    }}
                    variant="primary"
                    h={rem(80)}
                >
                    Back
                </BrandButton>
            </Link>
            <BrandButton
                size="lg"
                isGradient={true}
                isPattern={true}
                style={{
                    fontFamily: 'Coiny',
                    fontSize: '2.5em',
                    borderRadius: '40px',
                    color: '#00005C',
                }}
                variant="secondary"
                w="70%"
                h={rem(80)}
            >
                Letters
            </BrandButton>
            <Link to="/">
                <BrandButton
                    size="lg"
                    isGradient={true}
                    style={{
                        fontFamily: 'Coiny',
                        fontSize: '2.5em',
                        borderRadius: '20px',
                        color: 'white',
                    }}
                    variant="primary"
                    h={rem(80)}
                >
                    Home
                </BrandButton>
            </Link>
        </Flex>
    )
}

type HeaderProps = {
    type?: 'sectionLayoutHeader' | 'mainLayoutHeader'
    hideBGColor?: boolean
}

const Header: FC<HeaderProps> = (props) => {
    if (props.type === 'sectionLayoutHeader') return <SectionLayoutHeader />
    return <MainLayoutHeader hideBGColor={props.hideBGColor} />
}

export default Header
