import styles from './Profile.module.css'
import { Group, rem, Flex, Title, Text, Alert, Box, Image } from '@mantine/core'
import BackgroundImage from '@/components/backgroundImage/BackgroundImage'
import AvatarDefault from '@/assets/profile/avatardefault.png'
import Background from '@/assets/backgrounds/universal.svg'
import BrandInput from '@/components/brandInput/BrandInput'
import BrandButton from '@/components/brandButton/BrandButton'
import { useForm } from '@mantine/form'
import { ResponseFormat } from '@/types/api'
import { useEffect, useState } from 'react'
import { isServerError } from '@/utils/checkError'
import { useSelector } from 'react-redux'
import { StoreState } from '@/store'
import { useUpdateUserMutation } from '@/store/apiSlices/private/userSlice'

interface FormState {
    firstName: string
    lastName: string
    email: string
    country: string
}

const Profile = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null) // State for error message
    // const navigate = useNavigate()

    const profile = useSelector((store: StoreState) => {
        return store['profile-state']
    })
    const [user, setUser] = useState(profile.me)
    useEffect(() => {
        setUser(profile.me)
    }, [profile])

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    const form = useForm<FormState>({
        initialValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            country: user?.info?.country || '',
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

    const handleUpdateUserFormSubmit = form.onSubmit(async (values) => {
        try {
            setErrorMessage(null)

            const response = await updateUser({
                firstName: values.firstName,
                lastName: values.lastName,
                email: '',
                info: { country: values.country },
            }).unwrap()

            if (response.data) {
                window.location.href = response.data
            }

            if (!response.data) {
                alert(response?.message || '')
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
            <Flex className={styles.container} wrap={'wrap'} gap={40}>
                <Group className={styles.leftBox}>
                    <Flex
                        direction={'column'}
                        justify={'center'}
                        align={'center'}
                    >
                        <Box className={styles.userAvatarBox}>
                            <Image src={AvatarDefault} />
                        </Box>
                        <Text style={{ fontSize: '1.3rem' }}>
                            {user ? user.firstName + ' ' + user.lastName : ''}
                        </Text>
                        <BrandButton
                            borderWidth={2}
                            style={{ fontFamily: 'Coiny' }}
                            mt={10}
                        >
                            My Downloads
                        </BrandButton>
                        <BrandButton
                            borderWidth={2}
                            style={{ fontFamily: 'Coiny' }}
                            mt={10}
                        >
                            My Certificates
                        </BrandButton>
                    </Flex>
                </Group>

                <Group className={styles.contactBox}>
                    <Title order={1} c={'#151965'}>
                        <span className={styles.title}>My Profile</span>
                    </Title>
                    <form
                        className={styles.form}
                        onSubmit={handleUpdateUserFormSubmit}
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
                            <BrandInput
                                size="1.2em"
                                label="Country"
                                placeholder="Country"
                                type="text"
                                key={form.key('country')}
                                value={form.getValues().country}
                                onChange={async (e) => {
                                    form.setFieldValue(
                                        'country',
                                        e.target.value,
                                    )
                                }}
                                required
                            />
                        </Group>
                        <Flex justify={'space-between'} w={'80%'} wrap={'wrap'}>
                            <BrandButton
                                mt={rem(40)}
                                variant="secondary"
                                size="md"
                                className={styles.submitButton}
                            >
                                Choose Avatar
                            </BrandButton>
                            <BrandButton
                                mt={rem(40)}
                                variant="secondary"
                                size="md"
                                className={styles.submitButton}
                                type="submit"
                                loading={isUpdating}
                            >
                                Update
                            </BrandButton>
                        </Flex>
                    </form>
                </Group>
            </Flex>
        </>
    )
}

export default Profile
