import styles from './Login.module.css'
import { Group, rem, Flex, Title, Text } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import Background from '@/assets/backgrounds/universal.svg'
import BrandInput from '@/components/brandInput/BrandInput'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

const Login = () => {
    return (
        <>
            <BackgroundImage src={Background} opacity={0.2} />
            <Flex
                className={styles.container}
                justify="center"
                align="flex-start"
                wrap={'wrap'}
                gap={40}
                p={rem(20)}
            >
                <Group bg={'#fff'} className={styles.box}>
                    <Title order={1} size={30} c={'#151965'}>
                        <span className={styles.title}>Login</span>
                    </Title>
                    <form className={styles.form}>
                        <BrandInput
                            mt={rem(20)}
                            size="1.2em"
                            label="Email"
                            placeholder="Email"
                        />
                        <BrandInput
                            mt={rem(20)}
                            size="1.2em"
                            label="Password"
                            placeholder="Password"
                            type="password"
                        />
                        <BrandButton
                            mt={rem(40)}
                            variant="secondary"
                            size="md"
                            className={styles.submitButton}
                        >
                            Login
                        </BrandButton>
                        <Text
                            mt={rem(20)}
                            size="1.2em"
                            c={'#151965'}
                            className={styles.register}
                        >
                            Don't have an account?{' '}
                            <Link to="/register">Register</Link>
                        </Text>
                    </form>
                </Group>
            </Flex>
        </>
    )
}

export default Login
