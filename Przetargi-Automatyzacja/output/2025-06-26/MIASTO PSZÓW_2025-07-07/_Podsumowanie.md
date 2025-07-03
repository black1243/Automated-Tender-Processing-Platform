## SPECYFIKACJA PRODUKTÓW

### Część 1 – Wzmocnienie cyberbezpieczeństwa w Gminie Pszów poprzez dostawę sprzętu sieciowego i komputerowego oraz licencji systemowych

*   **System UTM (klaster HA):**
    *   Typ: Dwa urządzenia sieciowe typu UTM pracujące w trybie klastra HA.
    *   Licencja: 2 lata, Firewall z IPS, VPN, filtrowanie stron (15 kategorii), antywirus, antyspam.
    *   Obsługa sieci: IPv4, IPv6.
    *   Firewall: Stateful Inspection, NAT n:1, NAT 1:1, PAT, tryby pracy (router, bridge, hybryda), prekonfigurowane obiekty, reguły firewall (interfejsy, adresy IP, geolokalizacja, reputacja, web services, LDAP, DSCP, QoS, limit połączeń, harmonogramy). Filtrowanie na podstawie adresów MAC. Minimum 10 zestawów reguł. Analizator reguł. Uwierzytelnienie LDAP, RADIUS, Kerberos. Policy Based Routing.
    *   IPS: W jądrze systemu, od producenta urządzenia, min. 10 000 ataków i zagrożeń, tworzenie własnych sygnatur, usuwanie szkodliwej zawartości (HTML, JavaScript), inspekcja ruchu SSL (HTTPS, POP3S, SMTPS), tryby pracy (IPS, IDS, Firewall), ochrona przed SQL Injection, XSS, Web2.0. Analiza protokołów przemysłowych (Modbus, UMAS, S7 200-300-400, EtherNet /IP, CIP, OPC UA, OPC (DA/HDA/AE), BACnet/IP, PROFINET, SOFBUS/LACBUS, IE C 60870-5-104, IEC 61850 (MMS, Goose & SV)). Automatyczna aktualizacja sygnatur.
    *   Kształtowanie pasma: Priorytetyzacja ruchu, minimalna i maksymalna wartość pasma, ograniczenie pasma (połączenie, adres IP, użytkownik, DSCP), kolejki (monitoring), kształtowanie pasma na podstawie aplikacji.
    *   Antyspam: Klasyfikacja poczty (SPAM), białe/czarne listy, DNS RBL (edycja listy serwerów RBL), nagłówek wiadomości zgodny z Spamassassin.
    *   VPN: Client-to-site, site-to-site, PPTP VPN, IPSec VPN, SSL VPN (tunel, portal), klient VPN do pobrania od producenta, VPN Failover, X Auth, Hub ‘n’ Spoke, modconf, IPSec Policy Based i Route Based.
    *   Filtr WWW: Wbudowany filtr URL, min. 50 kategorii tematycznych, dodawanie własnych kategorii, akcje (blokowanie, zezwalanie, strona HTML), min. 4 strony blokady, zmienne środowiskowe, HTTPS, identyfikacja i blokowanie MIME, lista stron HTTPS bez deszyfrowania, SafeSearch.
    *   Uwierzytelnianie: Lokalny LDAP, zewnętrzny LDAP (min. 5), Microsoft Active Directory, captive portal (SSL, Radius, Kerberos), transparentna autoryzacja (bez agenta, bez modyfikacji schematu domeny), VDI (Citrix Virtual Apps, Microsoft RDS), 2FA (TOTP, SSLVPN, IPSec, portal, web GUI, SSH).
    *   Administracja łączami (ISP): Load Balancing (adres źródłowy, połączenie, wagi), Failover, SD-WAN (SLA, opóźnienie, jitter, utrata pakietów), monitorowanie (ICMP, TCP).
    *   Routing: Statyczny, IPv6 (statyczny, failover), Policy Based Routing, dynamiczny (RIPv2, OSPF, BGP).
    *   Administracja urządzeniem: Polski GUI (HTTP, HTTPS, port inny niż 443 TCP), wielu administratorów (uprawnienia), profile administracyjne, konsola (SSH), platforma centralnego zarządzania (HTTPS), narzędzia diagnostyczne (ping, traceroute, nslookup), przechwytywanie pakietów, otwarte połączenia, polityka haseł, script recording, obiekty sieciowe, portal, eksport logów (syslog, TLS, IPFIX), backup konfiguracji (manualny, automatyczny), anonimizacja logów, aktualizacja baz offline.
    *   Raportowanie: Wbudowany system raportowania (WEB, IPS, Antywirus, Antyspam), min. 25 raportów, edycja konfiguracji z raportu, eksport CSV, rozbudowa o dedykowany system (wirtualna maszyna), SNMP (v1, 2, 3), monitorowanie ruchu (GUI, SSH).
    *   Pozostałe usługi i funkcje: DHCP (dynamiczny, statyczny, DHCP Relay, IPv4, IPv6, brama, DNS, domena), DNS Proxy, IEEE 802.1Q VLAN, Open API, dwie partycje (synchronizacja), interfejs zagregowany (LACP).
    *   Gwarancja i serwis: 12 miesięcy (producent, elementy systemu, licencja, funkcje bezpieczeństwa), wsparcie techniczne (e-mail, portal).
    *   Parametry sprzętowe: Brak dysku twardego (pamięć flash), port na microSD, min. 8 portów Ethernet 2,5Gbps, min. 1 port światłowodowy 1Gbps, modem 3G/4G, Firewall – min. 8Gbps, Firewall+IPS – min. 4Gbps, Antywirus – min. 1Gbps, VPN (AES) – min. 2Gbps, VPN IPSec – min. 100, SSL VPN (tunel) – min. 100, SSL VPN (portal) – min. 100, VLAN – min. 128, sesje – min. 400 000 (min. 25 000 nowych sesji/sekundę), klaster HA (Active-Passive), brak limitu użytkowników, reguły filtrowania – min. 8 192, trasy statyczne – min. 512, trasy dynamiczne – min. 10 000, redundantne zasilanie (sygnalizacja), moduł TPM.
    *   Prace wdrożeniowe: Audyt, przeprojektowanie i wdrożenie reguł firewall i NAT, wydzielenie VLAN, testy funkcjonalne i wydajnościowe, symulacja awaryjna, optymalizacja konfiguracji, szkolenie administratorów, wsparcie techniczne (min. 3 miesiące, zdalne/lokalne).

*   **Przełączniki sieciowe (switch) - 10 szt.:**
    *   Typ: Zarządzalny.
    *   Porty: 8x RJ45 10/100/1000 Mb/s, 2x SFP, 1x konsolowy RJ45, 1x konsolowy microUSB.
    *   Zasilanie: 100-240 V AC~50/60 Hz.
    *   Montaż: Szafa rack/blat.
    *   Maks. zużycie energii: 7 W.
    *   Wydajność przełącznika: 20 Gb/s.
    *   Szybkość przekierowań pakietów: 14,89 Mp/s.
    *   Tablica adresów MAC: 8K.
    *   Bufor pakietów: 4,1 Mb.
    *   Ramki jumbo: 9 KB.
    *   Funkcja Quality of Service: 8 kolejek priorytetowania, 802.1p CoS/DSCP, harmonogram priorytetowania (SP, WRR, SP+WRR), kontrola przepustowości (port/przepływ), płynniejsze działanie, Mirror, Redirect, limit prędkości, QoS Remark.
    *   Cechy przełącznika L3: 16 interfejsów IPv4/IPv6, routing statyczny (48 tras), statyczne wpisy ARP (316), Proxy ARP, Gratuitous ARP, serwer DHCP, DHCP Relay, DHCP L2 Relay.
    *   Funkcje L2 i L2+: Agregacja łączy (statyczna, LACP 802.3ad, do 8 grup, do 8 portów na grupę), STP (802.1D), RSTP (802.1w), MSTP (802.1s), zabezpieczenia STP, wykrywanie pętli zwrotnych (port, VLAN), kontrola przepływu (802.3x, HOL), Mirroring (port, procesor, One-to-One, Many-to-One, port wejścia/wyjścia/oba).
    *   L2 Multicast: 511 grup IGMP (IPv4, IPv6), IGMP Snooping (v1/v2/v3, Fast Leave, Querier, uwierzytelnianie), MVR, MLD Snooping (v1/v2, Fast Leave, Querier, konfiguracja grupy statycznej, ograniczone przekazywanie), filtrowanie (256 profili, 16 wpisów na profil).
    *   Funkcje zaawansowane: Automatyczne wykrywanie urządzeń, konfiguracje grupowe, aktualizacje grupowe, monitorowanie stanu sieci, ostrzeżenia o nietypowych zdarzeniach, ujednolicony proces konfiguracji, harmonogram restartu.
    *   Sieci VLAN: Grupy VLAN (maks. 4K), tagowanie 802.1Q, MAC VLAN (12 wpisów), protokół VLAN, GVRP, VLAN VPN (QinQ), głosowa sieć VLAN.
    *   Listy kontroli dostępu: ACL oparta o czas, MAC ACL (adres MAC, ID VLAN, User Priority, Ethertype), IP ACL (adres IP, fragment, protokół IP, flaga TCP, port TCP/UDP, TOS DSCP/IP, User Priority), ACL IPv6, ACL zawartości pakietu, łączona ACL, polityka kontroli dostępu (Mirroring, Limit prędkości, Redirect, QoS Remark), ACL do portu/VLAN.
    *   Bezpieczeństwo transmisji: Wiązanie adresów IP, MAC i portów (DHCP Snooping, inspekcja ARP, IPv4), wiązanie adresów IPv6, MAC i portów (DHCPv6 Snooping, wykrywanie ND, IPv6), ochrona przed DoS, ochrona portów (statyczna/dynamiczna/stała konfiguracja, do 64 adresów MAC na port), Storm Control Broadcast/Multicast/Unicast (kb/s/wskaźnik), kontrola dostępu (IP/port/MAC), uwierzytelnianie 802.1X (port, adres MAC, przydzielanie VLAN, MAB, sieć VLAN dla gości, Radius), AAA (TACACS+), izolacja portów, HTTPS (SSLv3/TLS 1.2), CLI (SSHv1/SSHv2).
    *   IPv6: Dual IPv4/IPv6, MLD Snooping, ACL IPv6, interfejs IPv6, routing statyczny IPv6, neighbor discovery (ND), Path maximum transmission unit (MTU) discovery, ICMP v6, TCP v6/UDP v6, DHCPv6, Ping6, Tracert6, Telnet (v6), SNMP IPv6, SSH IPv6, SSL IPv6, Http/Https, TFTP IPv6.
    *   MIB: MIB II (RFC1213), Bridge MIB (RFC1493), P/Q-Bridge MIB (RFC2674), Radius Accounting Client MIB (RFC2620), Radius Authentication Client MIB (RFC2618), Zdalny Ping, Traceroute MIB (RFC2925), TP-Link MIB, RMON MIB(RFC1757, rmon 1,2,3,9).
    *   Funkcje panelu zarządzania: GUI, CLI, SNMP v1/v2c/v3 (Trap/Inform), RMON (grupy 1, 2, 3, 9), szablon SDM, klient DHCP/BOOTP, 802.1ab LLDP/LLDP-MED, autoinstalacja DHCP, Dual Image, Dual Configuration, monitorowanie zużycia procesora, diagnostyka kabli, EEE, odzyskiwanie hasła, SNTP, logi systemowe.
    *   Certyfikaty: CE, FCC, RoHS.
    *   Zawartość opakowania: Przełącznik, przewód zasilający, instrukcja instalacji, zestaw montażowy, gumowe nóżki.
    *   Warunki gwarancji: 2 lata (producent).

*   **Przełączniki sieciowe (switch) - 3 szt.:**
    *   Typ: Zarządzalny.
    *   Porty: 24x RJ45 10/100/1000 Mb/s, 4x SFP+ 10 G, 1x konsolowy RJ45, 1x konsolowy microUSB.
    *   Zasilanie: 100-240 V AC~50/60 Hz.
    *   Montaż: Szafa rack/blat.
    *   Maks. zużycie energii: 24 W.
    *   Wydajność przełącznika: 128 Gb/s.
    *   Szybkość przekierowań pakietów: 95,23 Mp/s.
    *   Tablica adresów MAC: 16K.
    *   Bufor pakietów: 12 Mb.
    *   Ramki jumbo: 9 KB.
    *   Funkcja Quality of Service: 8 kolejek priorytetowania, 802.1p CoS/DSCP, harmonogram priorytetowania (SP, WRR, SP+WRR), kontrola przepustowości (port/przepływ), płynniejsze działanie, Mirror, Redirect, limit prędkości, QoS Remark.
    *   Cechy przełącznika L3: 128 interfejsów IPv4/IPv6, routing statyczny (48 tras), statyczne wpisy ARP (128), Proxy ARP, Gratuitous ARP, serwer DHCP, DHCP Relay (Interface Relay, VLAN Relay), DHCP L2 Relay.
    *   Funkcje L2 i L2+: Agregacja łączy (statyczna, LACP 802.3ad, do 8 grup, do 8 portów na grupę), STP (802.1D), RSTP (802.1w), MSTP (802.1s), zabezpieczenia STP, wykrywanie pętli zwrotnych (port, VLAN), kontrola przepływu (802.3x, HOL), Mirroring (port, procesor, One-to-One, Many-to-One, port wejścia/wyjścia/oba).
    *   L2 Multicast: IGMP Snooping (v1/v2/v3, Fast Leave, Querier, uwierzytelnianie), MVR, MLD Snooping (v1/v2, Fast Leave, Querier, konfiguracja grupy statycznej, ograniczone przekazywanie), filtrowanie (256 profili, 16 wpisów na profil).
    *   Funkcje zaawansowane: Automatyczne wykrywanie urządzeń, konfiguracje grupowe, aktualizacje grupowe, monitorowanie stanu sieci, ostrzeżenia o nietypowych zdarzeniach, ujednolicony proces konfiguracji, harmonogram restartu.
    *   Sieci VLAN: Grupy VLAN (maks. 4K), tagowanie 802.1Q, MAC VLAN (7 wpisów), protokół VLAN, prywatna sieć VLAN, GVRP, VLAN VPN (QinQ), głosowa sieć VLAN.
    *   Listy kontroli dostępu: ACL oparta o czas, MAC ACL (adres MAC, ID VLAN, User Priority, Ethertype), IP ACL (adres IP, fragment, protokół IP, flaga TCP, port TCP/UDP, TOS DSCP/IP, User Priority), ACL IPv6, ACL zawartości pakietu, łączona ACL, polityka kontroli dostępu (Mirroring, Limit prędkości, Redirect, QoS Remark), ACL do portu/VLAN.
    *   Bezpieczeństwo transmisji: Wiązanie adresów IP, MAC i portów (512 wpisów, DHCP Snooping, inspekcja ARP, IPv4: 100 wpisów), wiązanie adresów IPv6, MAC i portów (512 wpisów, DHCPv6 Snooping, wykrywanie ND, IPv6: 100 wpisów), ochrona przed DoS, ochrona portów (statyczna/dynamiczna/stała konfiguracja, do 64 adresów MAC na port), Storm Control Broadcast/Multicast/Unicast (kb/s/wskaźnik), uwierzytelnianie 802.1X (port, adres MAC, przydzielanie VLAN, MAB, sieć VLAN dla gości, Radius), AAA (TACACS+), izolacja portów, HTTPS (SSLv3/TLS 1.2), CLI (SSHv1/SSHv2), kontrola dostępu (IP/port/MAC).
    *   IPv6: Dual IPv4/IPv6, MLD Snooping, ACL IPv6, interfejs IPv6, routing statyczny IPv6, neighbor discovery (ND), Path maximum transmission unit (MTU) discovery, ICMP v6, TCP v6/UDP v6, DHCPv6, Ping6, Tracert6, Telnet (v6), SNMP IPv6, SSH IPv6, SSL IPv6, Http/Https, TFTP IPv6.
    *   MIB: Bazy danych MIB II (RFC1213), Porty MIB (RFC2233), Port Ethernet MIB (RFC1643), Bridge MIB (RFC1493), P/Q-Bridge MIB (RFC2674), RMON MIB (RFC2819), RMON2 MIB (RFC2021), Radius Accounting Client MIB (RFC2620), Radius Authentication Client MIB (RFC2618), Pakiety Ping i Traceroute do interfejsu MIB (RFC2925), TP-Link.
    *   Funkcje panelu zarządzania: GUI, CLI, SNMP v1/v2c/v3 (Trap/Inform), RMON (grupy 1, 2, 3, 9), szablon SDM, klient DHCP/BOOTP, 802.1ab LLDP/LLDP-MED, autoinstalacja DHCP, Dual Image, Dual Configuration, monitorowanie zużycia procesora, diagnostyka kabli, EEE, odzyskiwanie hasła, SNTP, logi systemowe.
    *   Certyfikaty: CE, FCC, RoHS.
    *   Zawartość opakowania: Przełącznik, przewód zasilający, instrukcja instalacji, zestaw montażowy, gumowe nóżki.
    *   Warunki gwarancji: 2 lata (producent).

*   **Zasilacze awaryjne UPS - 10 szt.:**
    *   Typ: Zasilacz awaryjny UPS.
    *   Akumulator: 1 x 12V/9Ah.
    *   Moc: 480W.
    *   Napięcie wejściowe: 220/230/240 V.
    *   Częstotliwość wejściowa: 50/60 Hz.
    *   Napięcie wyjściowe: 230V AC.
    *   Częstotliwość wyjściowa: 50Hz lub 60Hz (automatyczne wykrywanie).
    *   Czas reakcji: 2-6 ms.
    *   Kształt napięcia wyjściowego: Modyfikowana sinusoida.
    *   Czas ładowania: 6-8 h.
    *   Gniazda: 6x Schuko.
    *   Moc pozorna: 600VA-999VA.
    *   Topologia: Line-Interactive AVR.
    *   Zabezpieczenia: Termiczne, przeciwprzepięciowe, przeciwzwarciowe.
    *   Zabezpieczenie przed przepięciami: RJ45.
    *   Warunki gwarancji: 2 lata. Akumulator - 12 miesięcy.

*   **Rozwiązanie do tworzenia i odtwarzania kopii zapasowych:**
    *   Typ: Dedykowany serwer i oprogramowanie do realizacji oraz odtwarzania kopii zapasowych.
    *   Konstrukcja: RACK 2U, szyny, możliwość instalacji 10 dysków 3,5" hot plug, możliwość rozbudowy o fizyczne zabezpieczenie, 2x SSD SATA 960GB Hot-Plug DWP D min 5, 3x 8TB SATA Hot Plug, możliwość instalacji napędu optycznego (25GB).
    *   Płyta główna: Dwuprocesorowa, producent serwera, możliwość instalacji procesorów 38-rdzeniowych, TPM 2.0, 6x PCI Express gen. 4 (4x x16, 2x x8), opcjonalnie 2 złącza pełnej wysokości, opcjonalnie 9 aktywnych interfejsów PCI-e, 32 gniazda RAM, obsługa min. 6 TB RAM DDR4, Memory Scrubbing, SDDC, ECC, Memory Mirroring, ADDDC, możliwość instalacji 2 dysków M.2.
    *   Procesory: 8-rdzeniowy, taktowanie bazowe 2,8GHz, architektura x86_64, SPECrate2017_int_base 130 pkt (dla 2 procesorów, opublikowane na spec.org).
    *   Pamięć RAM: 64 GB DDR4 Registered 3200MT/s.
    *   Dyski twarde: 2x SSD SATA 960GB Hot-Plug DWP D min 5, 3x 8TB SATA Hot Plug.
    *   Kontrolery LAN: 4x 1Gbit Base-T, 2x 10Gbit SFP+.
    *   Kontrolery I/O: Kontroler SAS RAID (4GB cache, RAID 0,1,10,5,50,6,60).
    *   Porty: VGA, 2x USB 3.0 (tył), 2x USB 3.0 (przód), 2x USB 3.0 (wewnątrz), możliwość rozbudowy o 1 port serial.
    *   Zasilanie, chłodzenie: Redundantne zasilacze hotplug (96%, 900W), redundantne wentylatory hotplug.
    *   Zarządzanie: Diody informacyjne, system przewidywania awarii, status komponentów (karty rozszerzeń, CPU, RAM, M.2 SSD, karta zarządzająca, wentylatory, bateria BIOS, zasilacze), kontroler sprzętowy zdalnego zarządzania zgodny z IPMI 2.0 (niezależny od OS, dedykowana karta LAN 1 Gb/s, Web, SSH, zarządzanie mocą, alarmy SNMP, przejęcie konsoli tekstowej, przekierowanie konsoli graficznej, montowanie zdalnych napędów, serwery proxy, VLAN, MTU, SSDP, TLS 1.2, SSL v3, LDAP, integracja z HP SIM, synchronizacja czasu NTP, backup/odtwarzanie ustawień BIOS i karty zarządzającej), oprogramowanie zarządzające, możliwość zdalnej reinstalacji systemu, aktualizacja BIOS, Firmware, sterowników z GUI karty zarządzającej.
    *   Wspierane OS: Microsoft Windows Server 2022, 2019; VMWare vSphere 8.0; Suse Linux Enterprise Server 15; Red Hat Enterprise Linux 9, 8; Microsoft Hyper-V Server 2019.
    *   Gwarancja: 5 lat (producent, on-site, reakcja do końca następnego dnia, dyski u klienta), funkcja automatycznego zgłaszania usterek, ISO 9001:2000 (serwis), bezpłatne poprawki i aktualizacje BIOS/Firmware/sterowników dożywotnio, możliwość odpłatnego wydłużenia gwarancji do 7 lat.
    *   Certyfikaty: CB, RoHS, WEEE, CE.
    *   Dokumentacja, inne: Elementy producenta lub certyfikowane, gwarancja producenta, nowy z oficjalnego kanału dystrybucyjnego w UE, ogólnopolska infolinia, weryfikacja konfiguracji sprzętowej po numerze seryjnym, aktualizacja sterowników ze strony producenta.
    *   Oprogramowanie: Odporność na ransomware, zgodność z regulacjami (SEC 17a-4(f), FINRA 4511(c), CFTC 1.31(c)-(d), IDW PS 880), obiektowa pamięć masowa z niezmiennością, repozytorium (serwer fizyczny), hardening, atrybut „immutability”, repozytorium na serwerze sprzętowym, podstawowe lub dodatkowe miejsce składowania.
    *   Wdrożenie: Konfiguracja serwera, instalacja i hardening OS, instalacja i konfiguracja repozytorium, konfiguracja zadań backupu, szkolenie administratorów, dokumentacja powykonawcza, integracja z infrastrukturą IT, wsparcie techniczne (min. 3 miesiące, zdalne/lokalne).
    *   Rok produkcji: Fabrycznie nowy.
    *   Licencje: Dożywotnie.

*   **Licencje systemu serwerowego - 2 komplety:**
    *   Każdy komplet licencji uprawnia do uruchamiania co najmniej dwóch serwerowych systemów operacyjnych w środowisku wirtualnym.
    *   Licencje obejmują dwa procesory fizyczne (16 rdzeni każdy, łącznie 32 rdzenie).
    *   Oba komplety licencji pokrywają wszystkie 32 rdzenie fizyczne serwera dwukrotnie (zasady licencjonowania producenta), umożliwiając legalne uruchomienie czterech maszyn wirtualnych Windows Server Standard.
    *   Licencja zgodna z zasadami licencjonowania producenta.
    *   Serwerowy system operacyjny w pełni kompatybilny z licencjami dostępowymi (CAL) dla Windows Server 2019.
    *   Licencja nieograniczona czasowo.
    *   Cechy serwerowego systemu operacyjnego:
        1.  Wykorzystanie 320 logicznych procesorów i 4 TB RAM.
        2.  Wykorzystywanie 64 procesorów wirtualnych, 1TB RAM i dysku 64TB przez wirtualny serwer.
        3.  Klastry 64 węzłów, 7000 maszyn wirtualnych.
        4.  Migracja maszyn wirtualnych (Ethernet, bez współdzielenia pamięci).
        5.  Wsparcie dodawania i wymiany pamięci RAM bez przerywania pracy.
        6.  Wsparcie dodawania i wymiany procesorów bez przerywania pracy.
        7.  Automatyczna weryfikacja sygnatur sterowników.
        8.  Dynamiczne obniżanie poboru energii przez rdzenie procesorów.
        9.  Wsparcie wolumenów (zmiana rozmiaru, migawki, kompresja, ACL).
        10. Klasyfikowanie i indeksowanie plików.
        11. Szyfrowanie dysków (certyfikat FIPS 140-2).
        12. Aplikacje internetowe ASP.NET.
        13. Dystrybucja ruchu sieciowego HTTP.
        14. Zapora internetowa (firewall).
        15. Dwa rodzaje interfejsu (klasyczny, dotykowy).
        16. Zlokalizowane w języku polskim (menu, przeglądarka, pomoc, komunikaty systemowe).
        17. Zmiana języka interfejsu (min. 10 języków).
        18. Logowanie (login/hasło, karty z certyfikatami, wirtualne karty TPM).
        19. Wymuszanie dynamicznej kontroli dostępu.
        20. Wsparcie urządzeń peryferyjnych.
        21. Zdalna konfiguracja, administrowanie, aktualizacja.
        22. Bezpłatne narzędzia badania i wdrażania polityk bezpieczeństwa.
        23. Serwis zarządzania polityką dostępu do informacji w dokumentach (Digital Rights Management).
        24. Wsparcie środowisk Java i .NET Framework 4.x.
        25. Funkcjonalności bez dodatkowych produktów:
            *   Podstawowe usługi sieciowe: DHCP i DNS wspierający DNSSEC.
            *   Usługi katalogowe LDAP i uwierzytelnianie stacji roboczych.
            *   Zdalna dystrybucja oprogramowania na stacje robocze.
            *   Praca zdalna na serwerze (terminal, cienki klient).
            *   Centrum Certyfikatów (CA), obsługa klucza publicznego i prywatnego.
            *   Szyfrowanie plików i folderów.
            *   Szyfrowanie połączeń sieciowych (IPSec).
            *   Systemy wysokiej dostępności (klastry failover) i rozłożenia obciążenia serwerów.
            *   Serwis udostępniania stron WWW.
            *   Wsparcie dla protokołu IP w wersji 6 (IPv6).
            *   Wsparcie dla algorytmów Suite B (RFC 4869).
            *   Wbudowane usługi VPN (nielimitowana liczba połączeń).
            *   Wbudowane mechanizmy wirtualizacji (Hypervisor, 1000 środowisk wirtualnych).
        26. Automatyczna aktualizacja.
        27. Wsparcie dostępu do zasobu dyskowego poprzez wiele ścieżek (Multipath).
        28. Instalacja poprawek do obrazu instalacyjnego.
        29. Mechanizmy zdalnej administracji (skrypty).
        30. Zarządzanie przez wbudowane mechanizmy (WBEM, WS-Management).

### Część 2 – Wzmocnienie cyberbezpieczeństwa w Gminie Pszów poprzez dostawę licencji na oprogramowanie typu EDR

*   **Oprogramowanie Endpoint Detection and Response (EDR) - 60 szt.:**
    *   Typ: Oprogramowanie Endpoint Detection and Response (EDR).
    *   Zastosowanie: Wykrywanie zagrożeń, analiza incydentów, automatyzacja reakcji, zarządzanie podatnościami, ochrona przed nowymi zagrożeniami.
    *   Licencja: 2-letnia, możliwość kontynuacji.
    *   Ilość: 60 sztuk.
    *   Interfejs: Polski.
    *   Wsparcie techniczne: Mailowe i telefoniczne, język polski.
    *   Podstawowe funkcjonalności systemu:
        *   Ochrona stacji roboczych:
            1.  Wsparcie Windows (10/11).
            2.  Wsparcie architektury ARM64.
            3.  Wykrywanie i usuwanie adware, spyware, dialer, phishing, narzędzi hakerskich, backdoor.
            4.  Ochrona przed rootkitami i botnet.
            5.  Wykrywanie potencjalnie niepożądanych, niebezpiecznych i podejrzanych aplikacji.
            6.  Skanowanie w czasie rzeczywistym (otwierane, zapisywane, wykonywane pliki).
            7.  Skanowanie dysku, katalogów, plików na żądanie lub według harmonogramu.
            8.  Skanowanie spakowanych/skompresowanych plików, dysków sieciowych i przenośnych.
            9.  Lista wykluczeń ze skanowania (pliki, katalogi, rozszerzenia, nazwy, sumy kontrolne SHA1, lokalizacje).
            10. Integracja z Intel Threat Detection Technology.
            11. Skanowanie poczty przychodzącej POP3 i IMAP „w locie”.
            12. Skanowanie ruchu sieciowego (HTTPS, POP3S, IMAPS).
            13. Dwa niezależne moduły heurystyczne (pasywne, aktywne, sztuczna inteligencja).
            14. Blokowanie nośników danych (pamięci masowe, optyczne, Firewire, urządzenia do tworzenia obrazów, drukarki USB, Bluetooth, czytniki kart, modemy, porty LPT/COM, urządzenia przenośne).
            15. Tworzenie reguł dla urządzeń (typ, numer seryjny, dostawca, model).
            16. Moduł HIPS (tryby pracy: automatyczny z regułami, interaktywny, oparty na regułach, uczenia się, inteligentny).
            17. Raport na temat stacji (aplikacje, usługi, informacje o systemie, sprzęcie, procesy, połączenia, harmonogram, plik hosts, sterowniki).
            18. Filtrowanie wyników raportu (9 poziomów).
            19. Automatyczna, inkrementacyjna aktualizacja silnika detekcji.
            20. Jeden proces w pamięci dla wszystkich funkcji.
            21. Skaner UEFI (ochrona przed uruchomieniem systemu).
            22. Ochrona antyspamowa dla Microsoft Outlook.
            23. Zapora osobista (tryby pracy: automatyczny, interaktywny, oparty na regułach, uczenia się).
            24. Moduł bezpiecznej przeglądarki.
            25. Szyfrowanie danych wprowadzanych przez użytkownika w przeglądarce.
            26. Wyróżnienie pracy w bezpiecznej przeglądarce (kolor ramki, informacja).
            27. Moduł kontroli dostępu do stron internetowych.
            28. Filtrowanie URL (min. 140 kategorii).
            29. Ochrona przed zagrożeniami 0-day.
            30. Wstrzymywanie uruchamiania pobieranych plików (przeglądarki, e-mail, nośniki, archiwa).

        *   Administracja zdalna w chmurze:
            1.  Dostępna w chmurze producenta.
            2.  Dostęp do konsoli centralnego zarządzania (WWW).
            3.  Zabezpieczenie SSL.
            4.  Wykrywanie sklonowanych maszyn.
            5.  Komunikacja agenta (HTTP Proxy).
            6.  Zarządzanie urząd