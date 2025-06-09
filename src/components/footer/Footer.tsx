import { Flex, Text } from '@mantine/core'

import styles from './Footer.module.css'

interface FooterType {
    hide?: boolean
}
const Footer = ({ hide }: FooterType) => {
    if (hide) return <></>

    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <Flex
                component="div"
                justify="center"
                align="center"
                style={{
                    background:
                        'linear-gradient(180deg,rgba(140, 46, 255, 0.8), #6829B3)',
                    fontFamily: 'Catamaran ',
                }}
                h={'100%'}
            >
                <Text
                    style={{
                        textAlign: 'center',
                    }}
                    c={'var(--primary)'}
                >
                    Copyright &copy; {currentYear} by UMMI. All rights reserved
                </Text>
            </Flex>
        </footer>
    )
}

export default Footer
