# London Bullion Market Association Precious Metal Price Index

## History
[Origins of the London Bullion Market](https://www.lbma.org.uk/market-standards/origins-of-the-london-bullion-market)

"When the Bank of England established LBMA in 1987, we took over the roles of two organisations – the London Gold Market and London Silver Market – with origins in the nineteenth century.

The world’s trade in bullion is London-based with a global reach of activity and participants. The roots of the London Bullion Market can be traced to the partnership between Moses Mocatta and the East India Company, who started shipping gold together towards the end of the 17th century. Shortly afterwards, while Sir Isaac Newton was master of the Royal Mint, gold in England was overvalued so it became more freely circulated than silver. This increased circulation quickly led to England having a gold based coinage, whereas the rest of Europe remained silver based until the 1850s."

## App Configuration

Create a *.env* file:
```bash
DBHOST=<ip address or server name>
DBPORT=<3306, 5432 or whatever port is being used>
DBUSER=<username>
DBPW=<user password>
DB=<finances or some name>
```

### Database

This code relies on a table with the following schema:

```sql
+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| objid           | bigint       | NO   | PRI | NULL    | auto_increment |
| entry_date      | datetime     | YES  |     | NULL    |                |
| price_date      | date         | YES  |     | NULL    |                |
| frn             | decimal(7,3) | YES  |     | NULL    |                |
| gbp             | decimal(7,3) | YES  |     | NULL    |                |
| eur             | decimal(7,3) | YES  |     | NULL    |                |
| frns_per_usd    | decimal(7,3) | YES  |     | NULL    |                |
| frns_per_dismes | decimal(7,3) | YES  |     | NULL    |                |
+-----------------+--------------+------+-----+---------+----------------+
```
```bash
Notes:
The code currently references the table *lbma_silver_prices*. Make sure to
use this name OR change the code to reflect the table name being used.

The *entry_date* field is populated by an insert trigger, so either create one in the table or adjust the code to insert the data entry date as well.
```

## Purpose of this code base

This code retrieves and stores the daily price of silver as determined by the LBMA.

While this data is available on line at the LBMA, maintaining a private repository of the price history seems important. For example, the Federal  Reserve decided to stop providing M1 and M2 data back in 2006 or so. To me this is a preparatory move in the overall strategy to obfuscate financial data and keep it out of the hands of the average person. 

If financial data becomes proprietary, over time, the people will lose all understanding of finance and economics, creating a path to the return of a peasant class and serfdom.

## Background

The nature of fiat currency is tightly connected to inflation and the way the buying power of money is diminished by the effects of inflation.

The US Treasury is the primary authority through which United States economic power is affected. In practical terms other effects may precede or follow the Treasury however, as a matter of lawful and legal effect, the Treasury is the prime authority for how currency moves in the United States.

While seeking to understand inflation and it's effect on the economy at an individual level, it occurred to me that I didn't understand what a "dollar" was in factual terms and as a matter of unitary economic power.

Looking at the [Coinage Act of 1792](https://en.wikipedia.org/wiki/Coinage_Act_of_1792) we can find the definition of a US Dollar in factual legal and lawful terms.

"A fixed exchange rate, often called a pegged exchange rate, is a type of exchange rate regime in which a currency's value is fixed or pegged by a monetary authority against the value of another currency, a basket of other currencies, or another measure of value, such as gold."

The Coinage Act of 1792  pegged the newly created United States dollar to the value of the widely used Spanish silver dollar, saying it was to have "the value of a Spanish milled dollar as the same is now current".

The Act authorized production of the following coins:

Coin|Value|Description
---|---|---
Eagles|	$10.00|	247+4⁄8 grain (16.04 g) pure or 270 grain (17.5 g) standard gold
Half eagles|$5.00|	123+6⁄8 grain (8.02 g) pure or 135 grain (8.75 g) standard gold
Quarter eagles|$2.50|	61+7⁄8 grain (4.01 g) pure or 67+4⁄8 grain (4.37 g) standard gold
Dollars or Units|$1.00|	371+4⁄16 grain (24.1 g) pure or 416 grain (27.0 g) standard silver
Half dollars|$0.50|	185+10⁄16 grain (12.0 g) pure or 208 grain (13.5 g) standard silver
Quarter dollars|$0.25|	92+13⁄16 grain (6.01 g) pure or 104 grains (6.74 g) standard silver
Dismes|	$0.10|37+2⁄16 grain (2.41 g) pure or 41+3⁄5 grain (2.70 g) standard silver
Half dismes[^1]|$0.05|18+9⁄16 grain (1.20 g) pure or 20+4⁄5 grain (1.35 g) standard silver
Cents or Pennies|$0.01|11 pennyweights (17.1 g) of copper
Half cents|$0.005|5+1⁄2 pennyweights (8.55 g) of copper

With the creation of the Federal Reserve, federal reserve notes were generated to supplant gold and silver certificate money, and during World War II President Franklin D. Roosevelt instituted a gold confiscation act that was the beginning of the theft of wealth from the American people at large. [Note that this is my intuitively deduced conclusion, based on the facts in evidence available to me. A more learned and deeper researched examination of the historical, legal and lawful facts and circumstances regarding this confiscation is needed.]

Initially when the Federal Reserve was created, 1 FRN was equal to 1 USD.

Over time, the FRN was debased[^2], and eventually it completely replaced currency backed by precious metals.

In 1974 Nixon removed, negated or otherwise detached our currency from substance by taking the US off the gold standard.[^3]

What I found significant in light of the primacy of federal reserve notes was to track the price of silver and compare it to the value of FRN's.

There is no consolidated record of gold and silver prices before 1964, so any price relationship prior to the creation of the federal reserve will have to be heavily researched.

Therefore, given the relationship between US Dollars (USD) and Federal Reserve Notes (FRN), it seems important to track the value shift between the value of a USD in terms of the coinage act compared with the amount of FRNs needed to buy an ounce of silver. This can be tracked by comparing how many FRN's are required to purchase silver and what ratio of USD that ounce of silver represents.

Since the symbol "$" today is really synonymous with FRNs, it is important to distinguish USD versus FRN when discussing prices.

Since a USD is still 27.0g of standard silver, the price of 1 oz of silver in "$" is the amount of FRNs required to purchase 1 oz of silver,
and the relationship is that 1 USD is representable in some amount of FRN's, since there is no longer a 1:1 equivalence between the two.

This proportion turns out to be the rate of inflation as well. FRNs are no longer a direct exchange with 1 USD. It takes more than 1 FRN to purchase 
1oz of silver. 

Thus our labor, expressed in FRN's essentially requires a greater amount of those FRN's to purchase what 1 USD can purchase.

The math is calculated in this way:

1 oz = 28.3495g

1 USD = 27g/416 grain silver

28.3495g - 27g = 1.3495g = 1 half dismes (nickel)

The ratio of 1 USD to 1 oz of silver is 27g/28.3495g = .9524, 

The ratio of 1 half dismes to 1 oz of silver is 1.3495g/28.3495g = .0481

1 oz of silver is equivalent to $1.05 USD.

Using the LBMA data, we are shown how many FRNs it takes to buy 1 ounce of silver and based on this data we can see how many FRNs are in a USD.

On 2017-03-31 1 oz of silver had a closing price of 18.060FRN

1 USD = .9524 of an ounce, therefore 1 USD = (.9524 * 18.060FRN) = 17.2003440FRN

If we look at two week averages of silver prices (tracking cost per payday), it will be easy to see that on average, it took 17FRNs to buy the same amount of products that takes 1 USD.

In essence we are using FRNs as type of scrip money and we are not making purchases with money backed by substance.

Our money is backed by "faith and credit". This means that the currency is manipulatable and this is the means by which
populaces are controlled. We are not obtaining a fair and consistent exchange of our labor when we deal in FRNs.

## The consequences of having FRN instead of USD
I have to do more research and find old notes, but apparently, the corporate United States government is in a form of 
voluntary bankruptcy where expenditures outside of the "household" are regulated and internally transactions are only done with scrip money.[^4]

We pay a fee for using the scrip money, because the Federal Reserve is the debt holder and they manage the transactions with entities "outside the household".

Also they charge a fee for creating the scrip money, and charge a tax for managing external transactions. But they also charge a fee for internal transactions so they are likely triple or even quadruple dipping in terms of fees on an individual basis within the citizenry.

As far as I can tell the Coinage Act of 1792 has never been repealed, and there does not seem to be any reason to repeal it. 

There have been subsequent coinage acts, but none of them have changed the defined value of US coin/currency.

This means that a USD is still defined as 27g of standard silver, therefore this fact seems to be significant.

I don't have enough solid research to make any claims nor do I wish to make this understanding broadly available as I think people will misuse this information and in fact use it before the implications and consequences of the understanding can be properly assessed.

So as an example in this table of price dates we can see that given the date and price, 1 USD is equivalent to *n* FRN's, and a dismes has a similar equivalence.


| price_date | frn    | gbp    | eur    | frns_per_usd | frns_per_dismes |
|------------|--------|--------|--------|--------------|-----------------|
| 2023-03-27 | 22.890 | 18.670 | 21.260 |       21.800 |           1.103 |
| 2023-03-28 | 23.045 | 18.720 | 21.300 |       21.948 |           1.111 |
| 2023-03-29 | 23.255 | 18.840 | 21.420 |       22.148 |           1.121 |

So on 2023-03-29, it takes 22.15 FRN's to buy what 1 USD would buy.

That means if gas is 4.75/gallon it's essentially 4*1.12 = 4.48 dismes or .20 + some pennies in USD. Maybe .25-.40 cents a gallon in USD.

What this demonstrates is that the wealth of people is being outright stolen on a daily basis by the federal reserve system, a dismes at a time.

[^1]: This term was adapted from the French word dixième, meaning "tenth".

[^2]: the process of printing more paper money without  backing it with real assets, leading to a decrease in its real value.

[^3]: It would be a very good idea to research this action by Nixon and determine the full facts as they stand.

[^4]: Revising this README 2024-11-11. There is a Chapter 9 Municipal Bankruptcy which may be the manner in which the currency system is operating. Further research is necessary