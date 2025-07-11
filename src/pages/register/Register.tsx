import styles from './Register.module.css'
import { Group, rem, Flex, Title, Text, Alert } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import Background from '@/assets/backgrounds/universal.svg'
import BrandInput from '@/components/brandInput/BrandInput'
import BrandButton from '@/components/brandButton/BrandButton'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateUserMutation } from '@/store/apiSlices/public/userSlice'
import { useForm } from '@mantine/form'
import { ResponseFormat } from '@/types/api'
import { useState } from 'react'
import { isServerError } from '@/utils/checkError'

interface FormState {
    firstName: string
    lastName: string
    email: string
    password: string
    confirm_password: string
}

const Register = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null) // State for error message
    const navigate = useNavigate()

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation()

    const form = useForm<FormState>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirm_password: '',
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

    const handleRegisterFormSubmit = form.onSubmit(async (values) => {
        try {
            setErrorMessage(null)

            const response = await createUser({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email.toLowerCase().trim(),
                password: values.password,
                confirmPassword: values.confirm_password,
            }).unwrap()

            if (response.data) {
                window.location.href = response.data
            }

            if (!response.data) {
                navigate('/login')
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
                wrap={'wrap'}
                gap={40}
            >
                <Group bg={'#fff'} className={styles.box}>
                    <Title order={1} c={'#151965'}>
                        <span className={styles.title}>Register</span>
                    </Title>
                    <form
                        className={styles.form}
                        onSubmit={handleRegisterFormSubmit}
                    >
                        {errorMessage && (
                            <Alert my={10} color="red" variant="filled">
                                {errorMessage}
                            </Alert>
                        )}
                        <Group className={styles.formGroup}>
                            <BrandInput
                                size="1.2em"
                                label="First Name"
                                placeholder="First Name"
                                key={form.key('firstName')}
                                value={form.getValues().firstName}
                                onChange={async (e) => {
                                    form.setFieldValue(
                                        'firstName',
                                        e.target.value,
                                    )
                                }}
                                required
                            />
                            <BrandInput
                                size="1.2em"
                                label="Last Name"
                                placeholder="Last Name"
                                key={form.key('lastName')}
                                value={form.getValues().lastName}
                                onChange={async (e) => {
                                    form.setFieldValue(
                                        'lastName',
                                        e.target.value,
                                    )
                                }}
                                required
                            />
                            <BrandInput
                                size="1.2em"
                                label="Email"
                                placeholder="Email"
                                key={form.key('email')}
                                value={form.getValues().email}
                                onChange={async (e) => {
                                    form.setFieldValue('email', e.target.value)
                                }}
                                required
                            />
                            <div></div>
                            <BrandInput
                                size="1.2em"
                                label="Password"
                                placeholder="Password"
                                type="password"
                                key={form.key('password')}
                                value={form.getValues().password}
                                onChange={async (e) => {
                                    form.setFieldValue(
                                        'password',
                                        e.target.value,
                                    )
                                }}
                                required
                            />
                            <BrandInput
                                size="1.2em"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                type="password"
                                key={form.key('confirm_password')}
                                value={form.getValues().confirm_password}
                                onChange={async (e) => {
                                    form.setFieldValue(
                                        'confirm_password',
                                        e.target.value,
                                    )
                                }}
                                required
                            />
                        </Group>
                        <BrandButton
                            mt={rem(40)}
                            variant="secondary"
                            size="md"
                            className={styles.submitButton}
                            type="submit"
                            loading={isCreating}
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
