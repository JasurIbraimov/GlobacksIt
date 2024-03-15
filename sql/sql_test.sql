WITH RecursiveSubdivisions AS (
    -- Получить данные "Сотрудника 1".
    SELECT 
        c.id AS id,
        c.name AS name,
        s.name AS sub_name,
        s.id AS sub_id,
        0 AS sub_level,
        COUNT(*) OVER (PARTITION BY s.id) AS cols_count
    FROM 
        dbo.collaborators c
    INNER JOIN 
        dbo.subdivisions s ON c.subdivision_id = s.id
    WHERE 
        c.age < 40  -- возраст менее 40 лет. 
        AND EXISTS (
            SELECT 1 
            FROM dbo.collaborators c1 
            WHERE c1.name = '��������� 1' AND c1.id = 710253 AND c.subdivision_id = c1.subdivision_id
        )
    UNION ALL
    -- Получить сотрудников всех нижестоящих подразделений.
    SELECT 
        c.id AS id,
        c.name AS name,
        s.name AS sub_name,
        s.id AS sub_id,
        rs.sub_level + 1 AS sub_level,
        COUNT(*) OVER (PARTITION BY s.id) AS cols_count
    FROM 
        dbo.collaborators c
    INNER JOIN 
        dbo.subdivisions s ON c.subdivision_id = s.id
    INNER JOIN 
        RecursiveSubdivisions rs ON s.parent_id = rs.sub_id
)

SELECT 
    id,
    name,
    sub_name,
    sub_id,
    sub_level,
    cols_count
FROM 
    RecursiveSubdivisions
WHERE 
    sub_id NOT IN (100055, 100059) -- Исключить из результирующей таблицы подразделения с id 100055 и 100059.
ORDER BY 
    sub_level ASC; -- Отсортировать по возрастанию уровня вложенности подразделения. 

