import { type ParseUserStatusReturn, parseUserStatus } from '@app/domains/common/utils';
import { type User, useAuth } from '@app/libs/auth';
import { useMemo } from 'react';

type UseUserStatusReturn = ParseUserStatusReturn & { user: User | null | undefined };

export default function useUserStatus(): UseUserStatusReturn {
    const { user } = useAuth();
    return useMemo(() => {
        return { user, ...parseUserStatus(user) };
    }, [user]);
}
