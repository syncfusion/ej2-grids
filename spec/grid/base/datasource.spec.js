define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = [
        {
            OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
            ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
            ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
        },
        {
            OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
            ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
            ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
        },
        {
            OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, OrderDate: new Date(8367642e5),
            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
        },
        {
            OrderID: 10251, CustomerID: 'VICTE', EmployeeID: 3, OrderDate: new Date(8367642e5),
            ShipName: 'Victuailles en stock', ShipCity: 'Lyon', ShipAddress: '2, rue du Commerce',
            ShipRegion: 'CJ', ShipPostalCode: '69004', ShipCountry: 'France', Freight: 41.34, Verified: !0
        },
        {
            OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 4, OrderDate: new Date(8368506e5),
            ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255',
            ShipRegion: 'CJ', ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 51.3, Verified: !0
        },
        {
            OrderID: 10253, CustomerID: 'HANAR', EmployeeID: 3, OrderDate: new Date(836937e6),
            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 58.17, Verified: !0
        },
        {
            OrderID: 10254, CustomerID: 'CHOPS', EmployeeID: 5, OrderDate: new Date(8370234e5),
            ShipName: 'Chop-suey Chinese', ShipCity: 'Bern', ShipAddress: 'Hauptstr. 31',
            ShipRegion: 'CJ', ShipPostalCode: '3012', ShipCountry: 'Switzerland', Freight: 22.98, Verified: !1
        },
        {
            OrderID: 10255, CustomerID: 'RICSU', EmployeeID: 9, OrderDate: new Date(8371098e5),
            ShipName: 'Richter Supermarkt', ShipCity: 'Genève', ShipAddress: 'Starenweg 5',
            ShipRegion: 'CJ', ShipPostalCode: '1204', ShipCountry: 'Switzerland', Freight: 148.33, Verified: !0
        },
        {
            OrderID: 10256, CustomerID: 'WELLI', EmployeeID: 3, OrderDate: new Date(837369e6),
            ShipName: 'Wellington Importadora', ShipCity: 'Resende', ShipAddress: 'Rua do Mercado, 12',
            ShipRegion: 'SP', ShipPostalCode: '08737-363', ShipCountry: 'Brazil', Freight: 13.97, Verified: !1
        },
        {
            OrderID: 10257, CustomerID: 'HILAA', EmployeeID: 4, OrderDate: new Date(8374554e5),
            ShipName: 'HILARION-Abastos', ShipCity: 'San Cristóbal', ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
            ShipRegion: 'Táchira', ShipPostalCode: '5022', ShipCountry: 'Venezuela', Freight: 81.91, Verified: !0
        },
        {
            OrderID: 10258, CustomerID: 'ERNSH', EmployeeID: 1, OrderDate: new Date(8375418e5),
            ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6',
            ShipRegion: 'CJ', ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 140.51, Verified: !0
        },
        {
            OrderID: 10259, CustomerID: 'CENTC', EmployeeID: 4, OrderDate: new Date(8376282e5),
            ShipName: 'Centro comercial Moctezuma', ShipCity: 'México D.F.', ShipAddress: 'Sierras de Granada 9993',
            ShipRegion: 'CJ', ShipPostalCode: '05022', ShipCountry: 'Mexico', Freight: 3.25, Verified: !1
        },
        {
            OrderID: 10260, CustomerID: 'OTTIK', EmployeeID: 4, OrderDate: new Date(8377146e5),
            ShipName: 'Ottilies Käseladen', ShipCity: 'Köln', ShipAddress: 'Mehrheimerstr. 369',
            ShipRegion: 'CJ', ShipPostalCode: '50739', ShipCountry: 'Germany', Freight: 55.09, Verified: !0
        },
        {
            OrderID: 10261, CustomerID: 'QUEDE', EmployeeID: 4, OrderDate: new Date(8377146e5),
            ShipName: 'Que Delícia', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua da Panificadora, 12',
            ShipRegion: 'RJ', ShipPostalCode: '02389-673', ShipCountry: 'Brazil', Freight: 3.05, Verified: !1
        },
        {
            OrderID: 10262, CustomerID: 'RATTC', EmployeeID: 8, OrderDate: new Date(8379738e5),
            ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.',
            ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 48.29, Verified: !0
        }
    ];
    exports.filterData = [
        {
            OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
            ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
            ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
        },
        {
            OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
            ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
            ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
        },
        {
            OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, OrderDate: new Date(8367642e5),
            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
        },
        {
            OrderID: 10251, CustomerID: 'VICTE', EmployeeID: 3, OrderDate: new Date(8367642e5),
            ShipName: 'Victuailles en stock', ShipCity: 'Lyon', ShipAddress: '2, rue du Commerce',
            ShipRegion: 'CJ', ShipPostalCode: '69004', ShipCountry: 'France', Freight: 41.34, Verified: !0
        },
        {
            OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 4, OrderDate: new Date(8368506e5),
            ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255',
            ShipRegion: 'CJ', ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 51.3, Verified: !0
        },
        {
            OrderID: 10253, CustomerID: 'HANAR', EmployeeID: 3, OrderDate: new Date(836937e6),
            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 58.17, Verified: !0
        },
        {
            OrderID: 10254, CustomerID: 'CHOPS', EmployeeID: 5, OrderDate: new Date(8370234e5),
            ShipName: 'Chop-suey Chinese', ShipCity: 'Bern', ShipAddress: 'Hauptstr. 31',
            ShipRegion: 'CJ', ShipPostalCode: '3012', ShipCountry: 'Switzerland', Freight: 22.98, Verified: !1
        },
        {
            OrderID: 10255, CustomerID: 'RICSU', EmployeeID: 9, OrderDate: new Date(8371098e5),
            ShipName: 'Richter Supermarkt', ShipCity: 'Genève', ShipAddress: 'Starenweg 5',
            ShipRegion: 'CJ', ShipPostalCode: '1204', ShipCountry: 'Switzerland', Freight: 148.33, Verified: !0
        },
        {
            OrderID: 10256, CustomerID: 'WELLI', EmployeeID: 3, OrderDate: new Date(837369e6),
            ShipName: 'Wellington Importadora', ShipCity: 'Resende', ShipAddress: 'Rua do Mercado, 12',
            ShipRegion: 'SP', ShipPostalCode: '08737-363', ShipCountry: 'Brazil', Freight: 13.97, Verified: !1
        },
        {
            OrderID: 10257, CustomerID: 'HILAA', EmployeeID: 4, OrderDate: new Date(8374554e5),
            ShipName: 'HILARION-Abastos', ShipCity: 'San Cristóbal', ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
            ShipRegion: 'Táchira', ShipPostalCode: '5022', ShipCountry: 'Venezuela', Freight: 81.91, Verified: !0
        },
        {
            OrderID: 10258, CustomerID: 'ERNSH', EmployeeID: 1, OrderDate: new Date(8375418e5),
            ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6',
            ShipRegion: 'CJ', ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 140.51, Verified: !0
        },
        {
            OrderID: 10259, CustomerID: 'CENTC', EmployeeID: 4, OrderDate: new Date(8376282e5),
            ShipName: 'Centro comercial Moctezuma', ShipCity: 'México D.F.', ShipAddress: 'Sierras de Granada 9993',
            ShipRegion: 'CJ', ShipPostalCode: '05022', ShipCountry: 'Mexico', Freight: 3.25, Verified: !1
        },
        {
            OrderID: 10260, CustomerID: 'OTTIK', EmployeeID: 4, OrderDate: new Date(8377146e5),
            ShipName: 'Ottilies Käseladen', ShipCity: 'Köln', ShipAddress: 'Mehrheimerstr. 369',
            ShipRegion: 'CJ', ShipPostalCode: '50739', ShipCountry: 'Germany', Freight: 55.09, Verified: !0
        },
        {
            OrderID: 10261, CustomerID: 'QUEDE', EmployeeID: 4, OrderDate: new Date(8377146e5),
            ShipName: 'Que Delícia', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua da Panificadora, 12',
            ShipRegion: 'RJ', ShipPostalCode: '02389-673', ShipCountry: 'Brazil', Freight: 3.05, Verified: !1
        },
        {
            OrderID: 10262, CustomerID: 'RATTC', EmployeeID: 8, OrderDate: new Date(8379738e5),
            ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.',
            ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 48.29, Verified: !0
        },
        {
            OrderID: 10263, CustomerID: 'ERNSH', EmployeeID: 9, OrderDate: new Date(8380602e5),
            ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6', ShipRegion: null, ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 146.06, Verified: !0
        }, { OrderID: 10264, CustomerID: 'FOLKO', EmployeeID: 6, OrderDate: new Date(8381466e5), ShipName: 'Folk och fä HB', ShipCity: 'Bräcke', ShipAddress: 'Åkergatan 24', ShipRegion: null, ShipPostalCode: 'S-844 67', ShipCountry: 'Sweden', Freight: 3.67, Verified: !1 }, { OrderID: 10265, CustomerID: 'BLONP', EmployeeID: 2, OrderDate: new Date(838233e6), ShipName: 'Blondel père et fils', ShipCity: 'Strasbourg', ShipAddress: '24, place Kléber', ShipRegion: null, ShipPostalCode: '67000', ShipCountry: 'France', Freight: 55.28, Verified: !0 }, { OrderID: 10266, CustomerID: 'WARTH', EmployeeID: 3, OrderDate: new Date(8383194e5), ShipName: 'Wartian Herkku', ShipCity: 'Oulu', ShipAddress: 'Torikatu 38', ShipRegion: null, ShipPostalCode: '90110', ShipCountry: 'Finland', Freight: 25.73, Verified: !1 }, { OrderID: 10267, CustomerID: 'FRANK', EmployeeID: 4, OrderDate: new Date(8385786e5), ShipName: 'Frankenversand', ShipCity: 'München', ShipAddress: 'Berliner Platz 43', ShipRegion: null, ShipPostalCode: '80805', ShipCountry: 'Germany', Freight: 208.58, Verified: !0 }, { OrderID: 10268, CustomerID: 'GROSR', EmployeeID: 8, OrderDate: new Date(838665e6), ShipName: 'GROSELLA-Restaurante', ShipCity: 'Caracas', ShipAddress: '5ª Ave. Los Palos Grandes', ShipRegion: 'DF', ShipPostalCode: '1081', ShipCountry: 'Venezuela', Freight: 66.29, Verified: !0 }, { OrderID: 10269, CustomerID: 'WHITC', EmployeeID: 5, OrderDate: new Date(8387514e5), ShipName: 'White Clover Markets', ShipCity: 'Seattle', ShipAddress: '1029 - 12th Ave. S.', ShipRegion: 'WA', ShipPostalCode: '98124', ShipCountry: 'USA', Freight: 4.56, Verified: !1 }, { OrderID: 10270, CustomerID: 'WARTH', EmployeeID: 1, OrderDate: new Date(8388378e5), ShipName: 'Wartian Herkku', ShipCity: 'Oulu', ShipAddress: 'Torikatu 38', ShipRegion: null, ShipPostalCode: '90110', ShipCountry: 'Finland', Freight: 136.54, Verified: !0 }, { OrderID: 10271, CustomerID: 'SPLIR', EmployeeID: 6, OrderDate: new Date(8388378e5), ShipName: 'Split Rail Beer & Ale', ShipCity: 'Lander', ShipAddress: 'P.O. Box 555', ShipRegion: 'WY', ShipPostalCode: '82520', ShipCountry: 'USA', Freight: 4.54, Verified: !1 }, { OrderID: 10272, CustomerID: 'RATTC', EmployeeID: 6, OrderDate: new Date(8389242e5), ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.', ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 98.03, Verified: !0 }, { OrderID: 10273, CustomerID: 'QUICK', EmployeeID: 3, OrderDate: new Date(8391834e5), ShipName: 'QUICK-Stop', ShipCity: 'Cunewalde', ShipAddress: 'Taucherstraße 10', ShipRegion: null, ShipPostalCode: '01307', ShipCountry: 'Germany', Freight: 76.07, Verified: !0 }, { OrderID: 10274, CustomerID: 'VINET', EmployeeID: 6, OrderDate: new Date(8392698e5), ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye', ShipRegion: null, ShipPostalCode: '51100', ShipCountry: 'France', Freight: 6.01, Verified: !1 }, { OrderID: 10275, CustomerID: 'MAGAA', EmployeeID: 1, OrderDate: new Date(8393562e5), ShipName: 'Magazzini Alimentari Riuniti', ShipCity: 'Bergamo', ShipAddress: 'Via Ludovico il Moro 22', ShipRegion: null, ShipPostalCode: '24100', ShipCountry: 'Italy', Freight: 26.93, Verified: !1 }, { OrderID: 10276, CustomerID: 'TORTU', EmployeeID: 8, OrderDate: new Date(8394426e5), ShipName: 'Tortuga Restaurante', ShipCity: 'México D.F.', ShipAddress: 'Avda. Azteca 123', ShipRegion: null, ShipPostalCode: '05033', ShipCountry: 'Mexico', Freight: 13.84, Verified: !1 }, { OrderID: 10277, CustomerID: 'MORGK', EmployeeID: 2, OrderDate: new Date(839529e6), ShipName: 'Morgenstern Gesundkost', ShipCity: 'Leipzig', ShipAddress: 'Heerstr. 22', ShipRegion: null, ShipPostalCode: '04179', ShipCountry: 'Germany', Freight: 125.77, Verified: !0 }, { OrderID: 10278, CustomerID: 'BERGS', EmployeeID: 8, OrderDate: new Date(8397882e5), ShipName: 'Berglunds snabbköp', ShipCity: 'Luleå', ShipAddress: 'Berguvsvägen  8', ShipRegion: null, ShipPostalCode: 'S-958 22', ShipCountry: 'Sweden', Freight: 92.69, Verified: !0 }, { OrderID: 10279, CustomerID: 'LEHMS', EmployeeID: 8, OrderDate: new Date(8398746e5), ShipName: 'Lehmanns Marktstand', ShipCity: 'Frankfurt a.M.', ShipAddress: 'Magazinweg 7', ShipRegion: null, ShipPostalCode: '60528', ShipCountry: 'Germany', Freight: 25.83, Verified: !1 }, { OrderID: 10280, CustomerID: 'BERGS', EmployeeID: 2, OrderDate: new Date(839961e6), ShipName: 'Berglunds snabbköp', ShipCity: 'Luleå', ShipAddress: 'Berguvsvägen  8', ShipRegion: null, ShipPostalCode: 'S-958 22', ShipCountry: 'Sweden', Freight: 8.98, Verified: !1 }, { OrderID: 10281, CustomerID: 'ROMEY', EmployeeID: 4, OrderDate: new Date(839961e6), ShipName: 'Romero y tomillo', ShipCity: 'Madrid', ShipAddress: 'Gran Vía, 1', ShipRegion: null, ShipPostalCode: '28001', ShipCountry: 'Spain', Freight: 2.94, Verified: !1 }, { OrderID: 10282, CustomerID: 'ROMEY', EmployeeID: 4, OrderDate: new Date(8400474e5), ShipName: 'Romero y tomillo', ShipCity: 'Madrid', ShipAddress: 'Gran Vía, 1', ShipRegion: null, ShipPostalCode: '28001', ShipCountry: 'Spain', Freight: 12.69, Verified: !1 }, { OrderID: 10283, CustomerID: 'LILAS', EmployeeID: 3, OrderDate: new Date(8401338e5), ShipName: 'LILA-Supermercado', ShipCity: 'Barquisimeto', ShipAddress: 'Carrera 52 con Ave. Bolívar #65-98 Llano Largo', ShipRegion: 'Lara', ShipPostalCode: '3508', ShipCountry: 'Venezuela', Freight: 84.81, Verified: !0 }, { OrderID: 10284, CustomerID: 'LEHMS', EmployeeID: 4, OrderDate: new Date(840393e6), ShipName: 'Lehmanns Marktstand', ShipCity: 'Frankfurt a.M.', ShipAddress: 'Magazinweg 7', ShipRegion: null, ShipPostalCode: '60528', ShipCountry: 'Germany', Freight: 76.56, Verified: !0 }, { OrderID: 10285, CustomerID: 'QUICK', EmployeeID: 1, OrderDate: new Date(8404794e5), ShipName: 'QUICK-Stop', ShipCity: 'Cunewalde', ShipAddress: 'Taucherstraße 10', ShipRegion: null, ShipPostalCode: '01307', ShipCountry: 'Germany', Freight: 76.83, Verified: !0 }, { OrderID: 10286, CustomerID: 'QUICK', EmployeeID: 8, OrderDate: new Date(8405658e5), ShipName: 'QUICK-Stop', ShipCity: 'Cunewalde', ShipAddress: 'Taucherstraße 10', ShipRegion: null, ShipPostalCode: '01307', ShipCountry: 'Germany', Freight: 229.24, Verified: !0 }, { OrderID: 10287, CustomerID: 'RICAR', EmployeeID: 8, OrderDate: new Date(8406522e5), ShipName: 'Ricardo Adocicados', ShipCity: 'Rio de Janeiro', ShipAddress: 'Av. Copacabana, 267', ShipRegion: 'RJ', ShipPostalCode: '02389-890', ShipCountry: 'Brazil', Freight: 12.76, Verified: !1 }, { OrderID: 10288, CustomerID: 'REGGC', EmployeeID: 4, OrderDate: new Date(8407386e5), ShipName: 'Reggiani Caseifici', ShipCity: 'Reggio Emilia', ShipAddress: 'Strada Provinciale 124', ShipRegion: null, ShipPostalCode: '42100', ShipCountry: 'Italy', Freight: 7.45, Verified: !1 }, { OrderID: 10289, CustomerID: 'BSBEV', EmployeeID: 7, OrderDate: new Date(8409978e5), ShipName: 'Bs Beverages', ShipCity: 'London', ShipAddress: 'Fauntleroy Circus', ShipRegion: null, ShipPostalCode: 'EC2 5NT', ShipCountry: 'UK', Freight: 22.77, Verified: !1 }, { OrderID: 10290, CustomerID: 'COMMI', EmployeeID: 8, OrderDate: new Date(8410842e5), ShipName: 'Comércio Mineiro', ShipCity: 'Sao Paulo', ShipAddress: 'Av. dos Lusíadas, 23', ShipRegion: 'SP', ShipPostalCode: '05432-043', ShipCountry: 'Brazil', Freight: 79.7, Verified: !0 }, { OrderID: 10291, CustomerID: 'QUEDE', EmployeeID: 6, OrderDate: new Date(8410842e5), ShipName: 'Que Delícia', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua da Panificadora, 12', ShipRegion: 'RJ', ShipPostalCode: '02389-673', ShipCountry: 'Brazil', Freight: 6.4, Verified: !1 }, { OrderID: 10292, CustomerID: 'TRADH', EmployeeID: 1, OrderDate: new Date(8411706e5), ShipName: 'Tradiçao Hipermercados', ShipCity: 'Sao Paulo', ShipAddress: 'Av. Inês de Castro, 414', ShipRegion: 'SP', ShipPostalCode: '05634-030', ShipCountry: 'Brazil', Freight: 1.35, Verified: !1 }, { OrderID: 10293, CustomerID: 'TORTU', EmployeeID: 1, OrderDate: new Date(841257e6), ShipName: 'Tortuga Restaurante', ShipCity: 'México D.F.', ShipAddress: 'Avda. Azteca 123', ShipRegion: null, ShipPostalCode: '05033', ShipCountry: 'Mexico', Freight: 21.18, Verified: !1 }, { OrderID: 10294, CustomerID: 'RATTC', EmployeeID: 4, OrderDate: new Date(8413434e5), ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.', ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 147.26, Verified: !0 }, { OrderID: 10295, CustomerID: 'VINET', EmployeeID: 2, OrderDate: new Date(8416026e5), ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye', ShipRegion: null, ShipPostalCode: '51100', ShipCountry: 'France', Freight: 1.15, Verified: !1 }, { OrderID: 10296, CustomerID: 'LILAS', EmployeeID: 6, OrderDate: new Date(841689e6), ShipName: 'LILA-Supermercado', ShipCity: 'Barquisimeto', ShipAddress: 'Carrera 52 con Ave. Bolívar #65-98 Llano Largo', ShipRegion: 'Lara', ShipPostalCode: '3508', ShipCountry: 'Venezuela', Freight: .12, Verified: !1 }, { OrderID: 10297, CustomerID: 'BLONP', EmployeeID: 5, OrderDate: new Date(8417754e5), ShipName: 'Blondel père et fils', ShipCity: 'Strasbourg', ShipAddress: '24, place Kléber', ShipRegion: null, ShipPostalCode: '67000', ShipCountry: 'France', Freight: 5.74, Verified: !1 }, { OrderID: 10298, CustomerID: 'HUNGO', EmployeeID: 6, OrderDate: new Date(8418618e5), ShipName: 'Hungry Owl All-Night Grocers', ShipCity: 'Cork', ShipAddress: '8 Johnstown Road', ShipRegion: 'Co. Cork', ShipPostalCode: null, ShipCountry: 'Ireland', Freight: 168.22, Verified: !0 }, { OrderID: 10299, CustomerID: 'RICAR', EmployeeID: 4, OrderDate: new Date(8419482e5), ShipName: 'Ricardo Adocicados', ShipCity: 'Rio de Janeiro', ShipAddress: 'Av. Copacabana, 267', ShipRegion: 'RJ', ShipPostalCode: '02389-890', ShipCountry: 'Brazil', Freight: 29.76, Verified: !1 }, { OrderID: 10300, CustomerID: 'MAGAA', EmployeeID: 2, OrderDate: new Date(8422074e5), ShipName: 'Magazzini Alimentari Riuniti', ShipCity: 'Bergamo', ShipAddress: 'Via Ludovico il Moro 22', ShipRegion: null, ShipPostalCode: '24100', ShipCountry: 'Italy', Freight: 17.68, Verified: !1 }, { OrderID: 10301, CustomerID: 'WANDK', EmployeeID: 8, OrderDate: new Date(8422074e5), ShipName: 'Die Wandernde Kuh', ShipCity: 'Stuttgart', ShipAddress: 'Adenauerallee 900', ShipRegion: null, ShipPostalCode: '70563', ShipCountry: 'Germany', Freight: 45.08, Verified: !0 }, { OrderID: 10302, CustomerID: 'SUPRD', EmployeeID: 4, OrderDate: new Date(8422938e5), ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255', ShipRegion: null, ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 6.27, Verified: !1 }, { OrderID: 10303, CustomerID: 'GODOS', EmployeeID: 7, OrderDate: new Date(8423802e5), ShipName: 'Godos Cocina Típica', ShipCity: 'Sevilla', ShipAddress: 'C/ Romero, 33', ShipRegion: null, ShipPostalCode: '41101', ShipCountry: 'Spain', Freight: 107.83, Verified: !0 }, { OrderID: 10304, CustomerID: 'TORTU', EmployeeID: 1, OrderDate: new Date(8424666e5), ShipName: 'Tortuga Restaurante', ShipCity: 'México D.F.', ShipAddress: 'Avda. Azteca 123', ShipRegion: null, ShipPostalCode: '05033', ShipCountry: 'Mexico', Freight: 63.79, Verified: !0 }, { OrderID: 10305, CustomerID: 'OLDWO', EmployeeID: 8, OrderDate: new Date(842553e6), ShipName: 'Old World Delicatessen', ShipCity: 'Anchorage', ShipAddress: '2743 Bering St.', ShipRegion: 'AK', ShipPostalCode: '99508', ShipCountry: 'USA', Freight: 257.62, Verified: !0 }, { OrderID: 10306, CustomerID: 'ROMEY', EmployeeID: 1, OrderDate: new Date(8428122e5), ShipName: 'Romero y tomillo', ShipCity: 'Madrid', ShipAddress: 'Gran Vía, 1', ShipRegion: null, ShipPostalCode: '28001', ShipCountry: 'Spain', Freight: 7.56, Verified: !1 }, { OrderID: 10307, CustomerID: 'LONEP', EmployeeID: 2, OrderDate: new Date(8428986e5), ShipName: 'Lonesome Pine Restaurant', ShipCity: 'Portland', ShipAddress: '89 Chiaroscuro Rd.', ShipRegion: 'OR', ShipPostalCode: '97219', ShipCountry: 'USA', Freight: .56, Verified: !1 }, { OrderID: 10308, CustomerID: 'ANATR', EmployeeID: 7, OrderDate: new Date(842985e6), ShipName: 'Ana Trujillo Emparedados y helados', ShipCity: 'México D.F.', ShipAddress: 'Avda. de la Constitución 2222', ShipRegion: null, ShipPostalCode: '05021', ShipCountry: 'Mexico', Freight: 1.61, Verified: !1 }, { OrderID: 10309, CustomerID: 'HUNGO', EmployeeID: 3, OrderDate: new Date(8430714e5), ShipName: 'Hungry Owl All-Night Grocers', ShipCity: 'Cork', ShipAddress: '8 Johnstown Road', ShipRegion: 'Co. Cork', ShipPostalCode: null, ShipCountry: 'Ireland', Freight: 47.3, Verified: !0 }, { OrderID: 10310, CustomerID: 'THEBI', EmployeeID: 8, OrderDate: new Date(8431578e5), ShipName: 'The Big Cheese', ShipCity: 'Portland', ShipAddress: '89 Jefferson Way Suite 2', ShipRegion: 'OR', ShipPostalCode: '97201', ShipCountry: 'USA', Freight: 17.52, Verified: !1 }, { OrderID: 10311, CustomerID: 'DUMON', EmployeeID: 1, OrderDate: new Date(8431578e5), ShipName: 'Du monde entier', ShipCity: 'Nantes', ShipAddress: '67, rue des Cinquante Otages', ShipRegion: null, ShipPostalCode: '44000', ShipCountry: 'France', Freight: 24.69, Verified: !1 }, { OrderID: 10312, CustomerID: 'WANDK', EmployeeID: 2, OrderDate: new Date(843417e6), ShipName: 'Die Wandernde Kuh', ShipCity: 'Stuttgart', ShipAddress: 'Adenauerallee 900', ShipRegion: null, ShipPostalCode: '70563', ShipCountry: 'Germany', Freight: 40.26, Verified: !0 }, { OrderID: 10313, CustomerID: 'QUICK', EmployeeID: 2, OrderDate: new Date(8435034e5), ShipName: 'QUICK-Stop', ShipCity: 'Cunewalde', ShipAddress: 'Taucherstraße 10', ShipRegion: null, ShipPostalCode: '01307', ShipCountry: 'Germany', Freight: 1.96, Verified: !1 }, { OrderID: 10314, CustomerID: 'RATTC', EmployeeID: 1, OrderDate: new Date(8435898e5), ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.', ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 74.16, Verified: !0 }, { OrderID: 10315, CustomerID: 'ISLAT', EmployeeID: 4, OrderDate: new Date(8436762e5), ShipName: 'Island Trading', ShipCity: 'Cowes', ShipAddress: 'Garden House Crowther Way', ShipRegion: 'Isle of Wight', ShipPostalCode: 'PO31 7PJ', ShipCountry: 'UK', Freight: 41.76, Verified: !0 }, { OrderID: 10316, CustomerID: 'RATTC', EmployeeID: 1, OrderDate: new Date(8437626e5), ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.', ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 150.15, Verified: !0 }, { OrderID: 10317, CustomerID: 'LONEP', EmployeeID: 6, OrderDate: new Date(8440218e5), ShipName: 'Lonesome Pine Restaurant', ShipCity: 'Portland', ShipAddress: '89 Chiaroscuro Rd.', ShipRegion: 'OR', ShipPostalCode: '97219', ShipCountry: 'USA', Freight: 12.69, Verified: !1 }, { OrderID: 10318, CustomerID: 'ISLAT', EmployeeID: 8, OrderDate: new Date(8441082e5), ShipName: 'Island Trading', ShipCity: 'Cowes', ShipAddress: 'Garden House Crowther Way', ShipRegion: 'Isle of Wight', ShipPostalCode: 'PO31 7PJ', ShipCountry: 'UK', Freight: 4.73, Verified: !1 }
    ];
});
