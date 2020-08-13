import React, { useState, useEffect } from "react"
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { useParams } from "react-router-dom";
import { getSession } from "../../services/auth";
import api from "../../services/api";

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: 'column',
        width: "90%",
        fontSize: 10,
        paddingTop: "7vh",
        paddingRight: "5vh",
        paddingBottom: "5vh",
        paddingLeft: "7vh",
    },
    titulo: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingBottom: 3
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        paddingLeft: 2,
        paddingRight: 2,
        fontSize: 10
    },
    image: {
        height: 50,
        width: 100,
        marginRight: 30
    },
});

const Relatorio = () => {
    const [dados, setDados] = useState([]);
    const { param } = useParams();

    useEffect(() => {
        const request = async () => {
            const session = getSession();
            const response = await api.get("relatorioLivros", {
                params: {
                    tipo: param
                },
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            })

            if (response.data.error) {
                return;
            }

            setDados(response.data);
        }

        request();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PDFViewer width="100%" height={window.innerHeight + 'px'} onLoadError={(error) => alert('Error while loading document! ' + error.message)}>
            <Document
                title="Relatório de livros"
                onLoadError={(error) => alert('Error while loading document! ' + error.message)}
                style={{ padding: "2vh" }}
            >
                <Page size="A4" style={styles.page}>
                    <View style={styles.titulo}>
                        <Image src="assets/Logo2.png" style={styles.image} fixed={true} />
                        <Text style={{ fontSize: 30 }} fixed={true}>Relatório de Livros</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow} fixed={true}>
                            <View style={[styles.tableCol, { width: "7vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>#</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "70vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Nome do livro</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "50vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Autor</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "12vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Qtde</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "30vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Tipo</Text>
                            </View>
                        </View>
                        {dados.map((item, index) => {
                            return (
                                <>
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCol, { width: "7vh" }]}>
                                            <Text style={styles.tableCell}>{item.id_livro}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "70vh" }]}>
                                            <Text style={styles.tableCell}>{item.nome}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "50vh" }]}>
                                            <Text style={styles.tableCell}>{item.autor}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "12vh", alignItems: "flex-end" }]}>
                                            <Text style={styles.tableCell}>{item.quantidade}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "30vh" }]}>
                                            <Text style={styles.tableCell}>{item.tipo}</Text>
                                        </View>
                                    </View>
                                </>
                            )
                        })}
                    </View>
                </Page>
            </Document>
        </PDFViewer >
    )
}

export default Relatorio;