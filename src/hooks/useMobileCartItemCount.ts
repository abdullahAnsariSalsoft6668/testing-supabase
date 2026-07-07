import { useGetMobileCartQuery } from '@/api/cartApiSlice';
import { mapApiCartLineItems } from '@/screens/main/Cart/mapApiCart';
import { RootState } from '@/redux/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/** Total item quantity in the mobile cart (sum of line quantities). */
export function useMobileCartItemCount(): number {
    const token = useSelector((s: RootState) => s.auth.auth_token);
    const isLoggedIn = Boolean(token?.trim());
    const { data } = useGetMobileCartQuery(undefined, { skip: !isLoggedIn });

    return useMemo(() => {
        const lines = mapApiCartLineItems(data?.items);
        return lines.reduce((sum, line) => sum + line.quantity, 0);
    }, [data?.items]);
}
