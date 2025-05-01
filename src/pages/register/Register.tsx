import styles from './Register.module.css'
import { Group, rem, Flex, Title, Text } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import Background from '@/assets/backgrounds/universal.svg'
import BrandInput from '@/components/brandInput/BrandInput'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link } from 'react-router-dom'

const Register = () => {
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
                mb={rem(100)}
            >
                <Group bg={'#fff'} className={styles.box}>
                    <Title order={1} size={30} c={'#151965'}>
                        <span className={styles.title}>Register</span>
                    </Title>
                    <form className={styles.form}>
                        <Group className={styles.formGroup}>
                            <BrandInput
                                mt={rem(20)}
                                size="1.2em"
                                label="First Name"
                                placeholder="First Name"
                            />
                            <BrandInput
                                mt={rem(20)}
                                size="1.2em"
                                label="Last Name"
                                placeholder="Last Name"
                            />
                            <BrandInput
                                mt={rem(20)}
                                size="1.2em"
                                label="Email"
                                placeholder="Email"
                            />
                            <div></div>
                            <BrandInput
                                mt={rem(20)}
                                size="1.2em"
                                label="Password"
                                placeholder="Password"
                                type="password"
                            />
                            <BrandInput
                                mt={rem(20)}
                                size="1.2em"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                type="password"
                            />
                        </Group>
                        <BrandButton
                            mt={rem(40)}
                            variant="secondary"
                            size="md"
                            className={styles.submitButton}
                        >
                            Register
                        </BrandButton>
                        <Text
                            mt={rem(20)}
                            size="1.2em"
                            c={'#151965'}
                            className={styles.login}
                        >
                            Already have an account?{' '}
                            <Link to="/login">Login</Link>
                        </Text>
                    </form>
                </Group>
            </Flex>
        </>
    )
}

export default Register
