import { Box, Flex, Overlay, rem, Stack, Transition } from '@mantine/core'
import { useDisclosure, useViewportSize } from '@mantine/hooks'
import { FC, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Burger } from '@mantine/core'

import Logo from '@/assets/icons/logo'
import styles from './Header.module.css'
import BrandButton from '../brandButton/BrandButton'
import { useSelector } from 'react-redux'
import { StoreState } from '@/store'

interface MainLayoutHeaderType {
    hideBGColor?: boolean
}
const MainLayoutHeader = ({ hideBGColor }: MainLayoutHeaderType) => {
    const [opened, { toggle }] = useDisclosure(false)

    const profile = useSelector((store: StoreState) => {
        return store['profile-state']
    })

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
                                to={profile.me ? '/profile' : '/login'}
                                radius="xl"
                                color="#8D2EFF"
                                mt={rem(24)}
                                fullWidth
                                onClick={toggle}
                            >
                                {profile.me ? 'My Account' : 'Login / Register'}
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
                        to={profile.me ? '/profile' : '/login'}
                        radius="xl"
                        size="lg"
                        variant="primary"
                    >
                        {profile.me ? 'My Account' : 'Login / Register'}
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
    const { width: viewportWidth } = useViewportSize()
    const isMobile = viewportWidth < 768

    const headerData = useSelector(
        (state: StoreState) => state['header-states'],
    )
    const [headerDataState, setHeaderDataState] = useState(headerData)

    useEffect(() => {
        setHeaderDataState(headerData)
    }, [headerData])

    return (
        <Flex
            component="header"
            className={styles.mainHeader}
            align="center"
            justify="space-between"
            gap={20}
        >
            {isMobile && (
                <>
                    <Link
                        to={'#'}
                        onClick={() => {
                            history.back()
                        }}
                    >
                        <BrandButton
                            isGradient={true}
                            style={{
                                fontFamily: 'Coiny',
                                fontSize: '1em',
                                borderRadius: '20px',
                                color: 'white',
                            }}
                            variant="primary"
                            borderWidth={2}
                            h={rem(50)}
                        >
                            Back
                        </BrandButton>
                    </Link>

                    <div>
                        <span
                            style={{
                                fontFamily: 'Coiny',
                                fontSize: '1em',
                                color: '#00005C',
                                textAlign: 'right',
                                width: '100%',
                                display: 'block',
                            }}
                        >
                            {headerDataState.title || 'Title'}
                        </span>
                        <span
                            style={{
                                fontFamily: 'Catamaran',
                                fontSize: '0.8em',
                                color: '#00005C',
                                fontWeight: 'bold',
                                textAlign: 'right',
                                width: '100%',
                                display: 'block',
                            }}
                        >
                            {headerDataState.subtitle || 'Subtitle'}
                        </span>
                    </div>
                </>
            )}
            {!isMobile && (
                <>
                    <Link
                        to={'#'}
                        onClick={() => {
                            history.back()
                        }}
                    >
                        <BrandButton
                            isGradient={true}
                            style={{
                                fontFamily: 'Coiny',
                                fontSize: '2em',
                                borderRadius: '20px',
                                color: 'white',
                            }}
                            variant="primary"
                            h={rem(70)}
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
                        h={rem(70)}
                    >
                        <div>
                            <span
                                style={{
                                    fontFamily: 'Coiny',
                                    fontSize: '0.6em',
                                    color: '#00005C',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    width: '100%',
                                    display: 'block',
                                }}
                            >
                                {headerDataState.title || 'Title'}
                            </span>
                            <span
                                style={{
                                    fontFamily: 'Catamaran',
                                    fontSize: '0.35em',
                                    color: '#00005C',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    width: '100%',
                                    display: 'block',
                                }}
                            >
                                {headerDataState.subtitle || 'Subtitle'}
                            </span>
                        </div>
                    </BrandButton>
                    <Link to="/">
                        <BrandButton
                            isGradient={true}
                            style={{
                                fontFamily: 'Coiny',
                                fontSize: '2em',
                                borderRadius: '20px',
                                color: 'white',
                            }}
                            variant="primary"
                            h={rem(70)}
                        >
                            Home
                        </BrandButton>
                    </Link>
                </>
            )}
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
