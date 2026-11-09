// Red < $100K, Orange $100K-$200K, Green > $200K
export const netWorthColor = (n) => (n < 100000 ? '239,48,34' : n <= 200000 ? '253,150,30' : '58,159,72')
