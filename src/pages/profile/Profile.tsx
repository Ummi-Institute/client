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
import {
    useUpdateUserMutation,
    useUpdateAvatarMutation,
} from '@/store/apiSlices/private/userSlice'
import { useDisclosure } from '@mantine/hooks'
import BoyAvatar from '@/assets/icons/boyAvatar'
import GirlAvatar from '@/assets/icons/girlAvatar'

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
    const [updateAvatar, { isLoading: isUpdatingAvatar }] =
        useUpdateAvatarMutation()

    const [openedAvatar, { open: openAvatar, close: closeAvatar }] =
        useDisclosure(false)

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

    const skinColors = ['#FFF5EC', '#FCE5D3', '#F2C09B', '#B68463']
    const [selectedSkinColor, setSelectedSkinColor] = useState<string | null>(
        user?.avatar?.skinTone || null,
    )
    const [selectedAvatar, setSelectedAvatar] = useState<'boy' | 'girl' | null>(
        user?.avatar?.gender || null,
    )

    useEffect(() => {
        setSelectedAvatar(user?.avatar?.gender || null)
        setSelectedSkinColor(user?.avatar?.skinTone || null)
    }, [user])

    const handleSaveAvatar = async () => {
        if (!selectedAvatar) return
        if (!selectedSkinColor) return

        try {
            const response = await updateAvatar({
                gender: selectedAvatar as 'boy' | 'girl',
                skinTone: selectedSkinColor,
            }).unwrap()

            alert(response?.message || 'Avatar updated successfully.')

            closeAvatar()
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
    }

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
                            {user?.avatar?.gender ? (
                                user.avatar.gender === 'boy' ? (
                                    <BoyAvatar
                                        skinColor={
                                            user.avatar.skinTone as string
                                        }
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            maxWidth: 120,
                                            maxHeight: 120,
                                        }}
                                    />
                                ) : (
                                    user?.avatar && (
                                        <GirlAvatar
                                            skinColor={
                                                user.avatar.skinTone as string
                                            }
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                maxWidth: 120,
                                                maxHeight: 120,
                                            }}
                                        />
                                    )
                                )
                            ) : (
                                !user?.avatar?.gender && (
                                    <Image
                                        src={AvatarDefault}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                )
                            )}
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

                {!openedAvatar && (
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
                                        form.setFieldValue(
                                            'email',
                                            e.target.value,
                                        )
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
                            <Flex
                                justify={'space-between'}
                                w={'80%'}
                                wrap={'wrap'}
                            >
                                <BrandButton
                                    mt={rem(40)}
                                    variant="secondary"
                                    size="md"
                                    className={styles.submitButton}
                                    onClick={openAvatar}
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
                )}
                {openedAvatar && (
                    <Group className={styles.contactBox}>
                        <Group
                            style={{
                                flexDirection: 'column',
                                alignItems: 'start',
                            }}
                        >
                            <Box className={styles.chooseAvatarBox}>
                                <Text size="xl" c={'#151965'}>
                                    Choose Your Avatar
                                </Text>
                                <div
                                    className={
                                        selectedAvatar == 'boy'
                                            ? styles.selectedAvatarItem +
                                              ' ' +
                                              styles.chooseAvatarItem
                                            : styles.chooseAvatarItem
                                    }
                                    onClick={() => {
                                        setSelectedAvatar('boy')
                                    }}
                                >
                                    <BoyAvatar
                                        skinColor={selectedSkinColor as string}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            maxWidth: 60,
                                            maxHeight: 60,
                                        }}
                                    />
                                </div>
                                <div
                                    className={
                                        selectedAvatar == 'girl'
                                            ? styles.selectedAvatarItem +
                                              ' ' +
                                              styles.chooseAvatarItem
                                            : styles.chooseAvatarItem
                                    }
                                    onClick={() => {
                                        setSelectedAvatar('girl')
                                    }}
                                >
                                    <GirlAvatar
                                        skinColor={selectedSkinColor as string}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            maxWidth: 60,
                                            maxHeight: 60,
                                        }}
                                    />
                                </div>
                            </Box>
                            <Box className={styles.skinColorBox}>
                                <Text size="md" c={'#151965'}>
                                    Choose Your Skintone
                                </Text>
                                <Flex gap={10} wrap={'wrap'}>
                                    {skinColors.map((color) => (
                                        <Box
                                            key={color}
                                            className={
                                                selectedSkinColor === color
                                                    ? styles.selectedSkinColor +
                                                      ' ' +
                                                      styles.skinColorItem
                                                    : styles.skinColorItem
                                            }
                                            style={{
                                                backgroundColor: color,
                                            }}
                                            onClick={() =>
                                                setSelectedSkinColor(color)
                                            }
                                        />
                                    ))}
                                </Flex>
                            </Box>
                        </Group>
                        <Flex justify={'space-between'} w={'80%'} wrap={'wrap'}>
                            <BrandButton
                                mt={rem(40)}
                                variant="secondary"
                                size="md"
                                className={styles.submitButton}
                                onClick={handleSaveAvatar}
                                loading={isUpdatingAvatar}
                                disabled={!selectedAvatar || !selectedSkinColor}
                            >
                                Save Avatar
                            </BrandButton>
                            <BrandButton
                                mt={rem(40)}
                                variant="secondary"
                                size="md"
                                className={styles.submitButton}
                                onClick={closeAvatar}
                            >
                                Cancel
                            </BrandButton>
                        </Flex>
                    </Group>
                )}
            </Flex>
        </>
    )
}

export default Profile
