import styles from './Login.module.css'
import { Group, rem, Flex, Title, Text, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import Background from '@/assets/backgrounds/universal.svg'
import BrandInput from '@/components/brandInput/BrandInput'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link, useNavigate } from 'react-router-dom'
import { useSigninMutation } from '@/store/apiSlices/public/authSlice'
import { useDispatch } from 'react-redux'
import { updateAuthState } from '@/store/stateSlices/authSlice'
import { ResponseFormat } from '@/types/api'
import { useState } from 'react'
import { isServerError } from '@/utils/checkError'

interface FormState {
    email: string
    password: string
}

const Login = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null) // State for error message
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [signin, { isLoading: isSigningin }] = useSigninMutation()

    const form = useForm<FormState>({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => {
                const trimmedValue = value.trim()
                if (!/^\S+@\S+\.\S+$/.test(trimmedValue)) {
                    return 'Invalid email address'
                }

                return null
            },
        },
    })

    const handleSinginFormSubmit = form.onSubmit(async (values) => {
        try {
            setErrorMessage(null)

            const response = await signin({
                email: values.email.toLowerCase().trim(),
                password: values.password,
            }).unwrap()

            if (response.data) {
                window.location.href = response.data
            }

            if (!response.data) {
                dispatch(
                    updateAuthState({
                        timestamp: response.timestamp,
                        refreshFailed: false,
                    }),
                )

                navigate('/')
            }
        } catch (error) {
            if (isServerError(error)) {
                const serverError = error as { data: ResponseFormat<undefined> }

                if (serverError.data.error?.code === 401) {
                    setErrorMessage('Incorrect Email or Password.')
                } else {
                    setErrorMessage(serverError.data.message)
                }
            } else {
                setErrorMessage(
                    'Failed to sign in to the account. Please try again.',
                )
            }
        }
    })

    return (
        <>
            <BackgroundImage src={Background} opacity={0.2} />
            <Flex
                className={styles.container}
                justify="center"
                align="flex-start"
                wrap={'wrap'}
            >
                <Group bg={'#fff'} className={styles.box}>
                    <Title order={1} c={'#151965'}>
                        <span className={styles.title}>Login</span>
                    </Title>
                    <form
                        className={styles.form}
                        onSubmit={handleSinginFormSubmit}
                    >
                        {errorMessage && (
                            <Alert my={10} color="red" variant="filled">
                                {errorMessage}
                            </Alert>
                        )}
                        <Group className={styles.formGroup}>
                            <BrandInput
                                size="1.2em"
                                label="Email"
                                placeholder="Email"
                                key={form.key('email')}
                                value={form.getValues().email}
                                onChange={async (e) => {
                                    form.setFieldValue('email', e.target.value)
                                }}
                            />
                            <BrandInput
                                mt={rem(20)}
                                size="1.2em"
                                label="Password"
                                placeholder="Password"
                                type="password"
                                key={form.key('password')}
                                value={form.getValues().password}
                                onChange={(e) => {
                                    form.setFieldValue(
                                        'password',
                                        e.target.value,
                                    )
                                }}
                            />
                            <BrandButton
                                mt={rem(40)}
                                variant="secondary"
                                size="md"
                                className={styles.submitButton}
                                type="submit"
                                loading={isSigningin}
                            >
                                Login
                            </BrandButton>
                        </Group>
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
