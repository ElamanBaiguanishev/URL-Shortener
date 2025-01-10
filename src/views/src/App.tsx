import { FC, useState, useEffect } from "react";
import { Container } from "@mui/material";
import CreateShortLink from "./components/CreateShortLink";
import LinksTable from "./components/LinksTable";
import { urlService } from "./api/UserService";
import { Link } from "./types/link";

const App: FC = () => {
  const [links, setLinks] = useState<Link[]>([]);

  const fetchLinks = async () => {
    try {
      const response = await urlService.getLinks();
      setLinks(response);
    } catch (err) {
      console.error("Ошибка при загрузке ссылок:", err);
    }
  };

  const handleLinkCreated = async () => {
    await fetchLinks(); // Обновляем список после создания новой ссылки
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <Container>
      <CreateShortLink onLinkCreated={handleLinkCreated} />
      <LinksTable links={links} />
    </Container>
  );
};

export default App;
